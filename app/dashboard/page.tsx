"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Download, CheckCircle2, XCircle, Star } from "lucide-react";

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

const extractKeyPoints = (text: string): string[] => {
  const points: string[] = [];

  const lines = text.split("\n");
  for (const line of lines) {
    if (
      line.match(/^\*\*[0-9]+\.|^\*\s|^\*\*[A-Za-z]/) ||
      line.includes("* **")
    ) {
      points.push(
        line
          .replace(/^\*\*|\*\*/g, "")
          .replace(/^\* /g, "")
          .replace(/^\d+\.\s*/g, "")
          .trim()
      );
    }
  }

  return points.filter((point) => point.length > 0).slice(0, 4);
};

const extractRecommendations = (text: string): string[] => {
  const recommendations = text
    .split("\n")
    .filter((line) => line.includes("* **"))
    .map((line) => line.replace(/^\* \*\*|\*\*/g, "").trim());

  return recommendations.filter((rec) => rec.length > 0).slice(0, 3);
};

const ScoreCard = ({ score }: { score: number }) => (
  <Card className="relative overflow-hidden w-full">
    <CardHeader className="space-y-1">
      <CardTitle className="text-xl md:text-2xl">Overall Score</CardTitle>
      <CardDescription>CV Match Analysis</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center my-2 md:my-4">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <span className="text-2xl md:text-4xl font-bold">{score}%</span>
          </div>
          <Progress
            value={score}
            className="h-20 w-20 md:h-24 md:w-24 rounded-full"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SectionCard = ({
  title,
  section,
}: {
  title: string;
  section: AnalysisSection;
}) => {
  const keyPoints = extractKeyPoints(section.summary);
  const recommendations = extractRecommendations(section.recommendations);

  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg md:text-xl">{title}</span>
          <span className="text-xl md:text-2xl font-bold">
            {section.score}%
          </span>
        </CardTitle>
        <Progress value={section.score} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Key Points</h3>
          <ul className="space-y-3">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                <span className="text-sm md:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        {recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm md:text-base">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


const SkillsBreakdown = ({ summary }: { summary: string }) => {
  const extractSkills = (text: string, category: string): string[] => {
    const categoryRegex = new RegExp(`\\*\\*${category}:\\*\\*([^*]+)`);
    const match = text.match(categoryRegex);
    if (!match) return [];

    return match[1]
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  };

  const programmingSkills = extractSkills(summary, "Programming Languages");
  const frontendSkills = extractSkills(summary, "Frontend Development");
  const backendSkills = extractSkills(summary, "Backend Development");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {[...programmingSkills, ...frontendSkills, ...backendSkills]
            .slice(0, 8)
            .map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-blue-500/10 text-sm whitespace-nowrap"
              >
                {skill}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function AnalysisDashboard() {
  const [results, setResults] = React.useState<AnalysisResult | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedResults = localStorage.getItem("analysisResults");
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        console.log(parsedResults);
        
        setResults(parsedResults.analysis);
      }
    } catch (error) {
      console.error("Error loading analysis results:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = () => {
    // Implement PDF download logic here
    console.log("Download PDF clicked");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "CV Analysis Results",
          text: "Check out my CV analysis results!",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-4xl font-bold">
          Loading analysis results...
        </h1>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">No analysis results available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              CV Analysis Results
            </h1>
            <p className="text-muted-foreground mt-2">Updated just now</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1 sm:flex-none"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Score and Technical Profile Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <ScoreCard score={results.overallScore} />
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Technical Profile
              </CardTitle>
              <CardDescription>Key skills and competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsBreakdown summary={results.skills.summary} />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="skills" className="flex-1">
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex-1">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="flex-1">
              Education
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="skills">
              <SectionCard title="Skills" section={results.skills} />
            </TabsContent>
            <TabsContent value="experience">
              <SectionCard title="Experience" section={results.experience} />
            </TabsContent>
            <TabsContent value="education">
              <SectionCard title="Education" section={results.education} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}