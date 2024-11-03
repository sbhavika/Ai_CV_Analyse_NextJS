import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
// import { Analytics } from '@/components/analytics';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CV Analyzer - Professional Resume Analysis Tool',
  description: 'Advanced CV analysis tool powered by AI to help you improve your resume and career prospects',
  keywords: 'CV analysis, resume checker, job search, career development, AI analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster />
          {/* <Analytics /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}