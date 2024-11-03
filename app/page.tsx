import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-50 dark:bg-gray-900">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24 flex-grow">
        <div className="container mx-auto max-w-4xl flex flex-col items-center gap-6 text-center px-4">
          <FileText className="h-16 w-16 text-primary dark:text-yellow-400" />
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-800 dark:text-white">
            Analyze Your CV with AI
          </h1>
          <p className="max-w-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Get instant, AI-powered feedback on your resume. Improve your
            chances of landing your dream job with our advanced analysis tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="hover:bg-primary-dark">
              <Link href="/analyze">
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="hover:border-primary hover:text-primary dark:hover:text-yellow-400"
            >
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto space-y-6 bg-gray-100 dark:bg-gray-800 py-8 px-4 md:py-12 lg:py-20">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-gray-800 dark:text-white">
            Features
          </h2>
          <p className="max-w-lg text-gray-600 dark:text-gray-300 sm:text-lg">
            Our AI-powered platform offers comprehensive CV analysis to help you
            stand out in the job market.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto flex justify-center">
          <FeatureCard
            icon={
              <Sparkles className="h-12 w-12 text-primary dark:text-yellow-400" />
            }
            title="AI Analysis"
            description="Advanced AI-powered analysis of your CV with detailed feedback."
          />
          <FeatureCard
            icon={
              <Globe className="h-12 w-12 text-primary dark:text-yellow-400" />
            }
            title="Global Insights"
            description="Location-based salary insights and job market analysis."
          />
          <FeatureCard
            icon={
              <Shield className="h-12 w-12 text-primary dark:text-yellow-400" />
            }
            title="Secure Upload"
            description="Secure file upload with virus scanning and encryption."
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className=" relative overflow-hidden rounded-lg border bg-white dark:bg-gray-700 p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex h-[180px] flex-col text-center items-center rounded-md p-4">
        {icon}
        <div className="space-y-4 text-gray-800 dark:text-gray-100 ">
          <h3 className="font-bold mt-4">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
