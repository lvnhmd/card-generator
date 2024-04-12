"use client"

import React from 'react'; // Add this line
import { useState } from 'react';
import Link from 'next/link';
// Import l-mammoth directly
import * as LMammoth from 'l-mammoth';
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input"

const Home: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (typeof window !== 'undefined' && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await file.arrayBuffer();
      LMammoth.convertToHtml({ arrayBuffer })
        .then((result: { value: string }) => {
          setFileContent(result.value);
          sessionStorage.setItem('fileContent', result.value);
        })
        .catch((err: Error) => console.error(err));
    } else {
      console.error("Unsupported file type or not in a browser environment");
    }
  };

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>From Job Spec to Flashcards</PageHeaderHeading>
        <PageHeaderDescription>
          Transform technical job specifications into actionable interview prep with our smart flashcard generator. Get ready to ace your next technical interview.
        </PageHeaderDescription>
        <PageActions>
          <Input type="file" onChange={handleFileChange} accept=".docx" />
          {fileContent && (
            <Link href="/editor" className={cn(buttonVariants())}>Go</Link>
          )}
        </PageActions>
      </PageHeader>
    </div>
  );
};

export default Home;

