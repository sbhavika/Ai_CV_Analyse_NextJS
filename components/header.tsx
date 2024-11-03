"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { FileText, Github } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span className="font-bold text-lg">CV Analyzer</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="flex-1 flex justify-center">
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/analyze" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Analyze CV</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="https://github.com/madhurajayashanka"
                target="_blank"
                className="flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
