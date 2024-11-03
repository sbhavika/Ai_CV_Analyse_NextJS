"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { FileUploader } from "@/components/file-uploader";
import { JobRoleSelect } from "@/components/job-role-select";
import { LocationSelect } from "@/components/location-select";
import { AnalysisProgress } from "@/components/analysis-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { initializeGemini } from "@/lib/gemini";
import { analyzeCVContent } from "../services/analysis";

type AnalysisStatus = "pending" | "processing" | "completed";

interface AnalysisStep {
  id: string;
  label: string;
  status: AnalysisStatus;
}

const analysisSteps: AnalysisStep[] = [
  { id: "upload", label: "Processing document", status: "pending" },
  { id: "scan", label: "Scanning for compatibility", status: "pending" },
  { id: "extract", label: "Extracting information", status: "pending" },
  { id: "analyze", label: "Analyzing content", status: "pending" },
  {
    id: "compare",
    label: "Comparing with job requirements",
    status: "pending",
  },
  { id: "generate", label: "Generating recommendations", status: "pending" },
];

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>(analysisSteps);

  const { toast } = useToast();
  const router = useRouter();

  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const updateStep = (stepId: string, status: AnalysisStatus) => {
    setSteps((current) =>
      current.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  function sanitizeContent(content: string) {
    // Strip out markdown headers
    return content.replace(/^(#{1,6})\s+/gm, "").trim();
  }


  const onSubmit = async () => {
    if (!file || !jobRole || !location) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);

      const content = await readFileContent(file);
      const sanitizedContent = sanitizeContent(content); // Sanitize content
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
      }

      const genAI = initializeGemini(apiKey);

      // Proceed with analyzing the sanitized content
      updateStep("upload", "processing");
      setProgress(20);

      updateStep("scan", "processing");
      setProgress(40);

      const results = await analyzeCVContent(sanitizedContent, jobRole, genAI);
      console.log(results);

      updateStep("extract", "processing");
      setProgress(60);

      updateStep("analyze", "processing");
      setProgress(80);

      localStorage.setItem("analysisResults", JSON.stringify(results));

      updateStep("generate", "completed");
      setProgress(100);

      toast({
        title: "Analysis Complete",
        description: "Your CV has been analyzed successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <Card className="border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Analyze Your CV
          </CardTitle>
          <CardDescription className="text-lg">
            Upload your CV and get detailed feedback to improve your chances of
            landing your dream job in your preferred industry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">
                <FileUploader
                  onFileSelect={(selectedFile) => setFile(selectedFile)}
                  accept=".pdf,.doc,.docx"
                />
                <JobRoleSelect
                  value={jobRole}
                  onChange={(value) => setJobRole(value)}
                />
                <LocationSelect
                  value={location}
                  onChange={(value) => setLocation(value)}
                />

                {isAnalyzing ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom">
                    <AnalysisProgress
                      steps={steps}
                      currentProgress={progress}
                    />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  >
                    Start Analysis
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
