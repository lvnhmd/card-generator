"use client"
import React, { useEffect, useState } from 'react';
import { RoughNotation } from "react-rough-notation";

interface KeywordPosition {
  start: number;
  end: number;
}

const keywordsList = {
  "Programming Languages": ["Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Golang", "TypeScript", "Swift", "Kotlin", "NodeJS", "Node.js", "Rust", "Scala", "Perl", "Haskell", "Clojure", "Elixir", "Lua", "Dart", "Julia", "R", "VHDL", "Verilog", "Matlab", "Solidity", "SQL", "PL/SQL", "T-SQL", "C", "C++", "Objective-C", "Assembly", "COBOL", "Fortran", "Pascal", "Ada", "Lisp", "Prolog", "Smalltalk", "Forth", "Erlang", "Bash", "Shell", "PowerShell", "Batch", "Groovy", "Racket", "Kotlin", "D", "Dylan", "F#", "OCaml", "Standard ML", "Go", "Crystal", "Nim","Node"],
  "Frameworks": ["React", "Angular", "Vue", "Django", "Flask", "Laravel", ".NET", "Spring", "Express", "Svelte", "Ruby on Rails", "Next.js", "Nuxt.js", "Gatsby", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright", "Symfony", "NextJS", "NuxtJS"],
  "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB"],
  "Technologies": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "WebSockets", "Elastic"],
};

// Flatten and lowercase the keywords for easier comparison
const flattenedKeywords: string[] = Object.values(keywordsList).flat().map(keyword => keyword.toLowerCase());

const Editor: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>("");
  const [highlightedKeywords, setHighlightedKeywords] = useState<Set<KeywordPosition>>(new Set());

  useEffect(() => {
    const storedText = sessionStorage.getItem('fileContent') || "";
    setOriginalText(storedText);

    const wordsArray = storedText.match(/[\w]+|\/|[^\w\s]/g) || [];
    const normalizedWordsArray = wordsArray.map(word => 
      word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    );

    const keywordPositions: Set<KeywordPosition> = new Set();
    let currentIndex = 0;
    normalizedWordsArray.forEach((word, index) => {
      if (flattenedKeywords.includes(word)) {
        const start = currentIndex;
        const end = start + wordsArray[index].length;
        keywordPositions.add({ start, end });
      }
      currentIndex += wordsArray[index].length;
      if (index < wordsArray.length - 1) {
        currentIndex += storedText.substring(currentIndex).indexOf(wordsArray[index + 1]);
      }
    });

    setHighlightedKeywords(keywordPositions);
  }, []);

  const renderTextWithHighlights = () => {
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    highlightedKeywords.forEach(({ start, end }) => {
      // Text before keyword
      if (start > lastIndex) {
        elements.push(<span key={`text-before-${start}`}>{originalText.slice(lastIndex, start)}</span>);
      }
      // Keyword text
      elements.push(
        <RoughNotation key={`keyword-${start}-${end}`} type="highlight" show={true} color="#FFD700" animate={false}>
          {originalText.slice(start, end)}
        </RoughNotation>
      );
      lastIndex = end;
    });

    // Remaining text after last keyword
    if (lastIndex < originalText.length) {
      elements.push(<span key={`text-after-${lastIndex}`}>{originalText.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
      {renderTextWithHighlights()}
    </div>
  );
};

export default Editor;
