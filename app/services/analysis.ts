import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisSection {
  summary: string;
  recommendations: string;
  score?: number;
}

interface AnalysisResult {
  skills: AnalysisSection;
  experience: AnalysisSection;
  education: AnalysisSection;
  overallScore: number;
}

// Simplified prompts that return markdown instead of JSON
const ANALYSIS_PROMPTS = {
  skills: (content: string, jobRole: string) => `
    Analyze the skills in this CV for a ${jobRole} position. Include:
    1. Key skills aligned with job requirements
    2. Candidate's strengths
    3. Critical missing skills
    4. Actionable suggestions for improvement
    
    Format the response in markdown with clear sections.
    
    CV Content: ${content}`,

  experience: (content: string, jobRole: string) => `
    Analyze the professional experience for a ${jobRole} position. Include:
    1. Relevance of past roles
    2. Key achievements
    3. Areas for improvement
    4. Suggestions to better present experience
    
    Format the response in markdown with clear sections.
    
    CV Content: ${content}`,

  education: (content: string, jobRole: string) => `
    Analyze the education section for a ${jobRole} position. Include:
    1. Relevance of qualifications
    2. Notable achievements
    3. Recommended additional certifications
    
    Format the response in markdown with clear sections.
    
    CV Content: ${content}`,
};

export async function analyzeCVContent(
  content: string,
  jobRole: string,
  genAI: GoogleGenerativeAI
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Helper function to process each analysis with retries
    const analyzeSection = async (
      prompt: string,
      retries = 3
    ): Promise<string> => {
      try {
        const result = await model.generateContent([prompt]);
        return result.response.text();
      } catch (error) {
        if (retries > 0 && (error as any).code === 429) {
          const waitTime = Math.pow(2, 3 - retries) * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return analyzeSection(prompt, retries - 1);
        }
        throw error;
      }
    };

    // Analyze each section
    const [skillsAnalysis, experienceAnalysis, educationAnalysis] =
      await Promise.all([
        analyzeSection(ANALYSIS_PROMPTS.skills(content, jobRole)),
        analyzeSection(ANALYSIS_PROMPTS.experience(content, jobRole)),
        analyzeSection(ANALYSIS_PROMPTS.education(content, jobRole)),
      ]);

    // Calculate simple scores based on content length and keyword presence
    const calculateScore = (content: string): number => {
      const keywords = ["excellent", "strong", "impressive", "good"];
      const score = keywords.reduce(
        (acc, word) => acc + (content.toLowerCase().includes(word) ? 5 : 0),
        50
      );
      return Math.min(100, Math.max(0, score));
    };

    const result: AnalysisResult = {
      skills: {
        summary: skillsAnalysis,
        recommendations: extractRecommendations(skillsAnalysis),
        score: calculateScore(skillsAnalysis),
      },
      experience: {
        summary: experienceAnalysis,
        recommendations: extractRecommendations(experienceAnalysis),
        score: calculateScore(experienceAnalysis),
      },
      education: {
        summary: educationAnalysis,
        recommendations: extractRecommendations(educationAnalysis),
        score: calculateScore(educationAnalysis),
      },
      overallScore: 0,
    };

    // Calculate overall score
    result.overallScore = Math.round(
      result.skills.score! * 0.4 +
        result.experience.score! * 0.4 +
        result.education.score! * 0.2
    );

    return {
      success: true,
      analysis: result,
    };
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return {
      success: false,
      message:
        "An error occurred while analyzing the CV. Please try again later.",
      error: (error as Error).message,
    };
  }
}

function extractRecommendations(content: string): string {
  const recommendationsSection =
    content.split("4.")[1] || content.split("Suggestions")[1] || "";
  return (
    recommendationsSection.trim() || "No specific recommendations provided."
  );
}
