"use client"
import { useEffect, useState } from 'react';
import { RoughNotation } from "react-rough-notation";

const keywordsList = {
  "Programming Languages": ["Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Golang", "TypeScript", "Swift", "Kotlin", "NodeJS", "Node.js", "Rust", "Scala", "Perl", "Haskell", "Clojure", "Elixir", "Lua", "Dart", "Julia", "R", "VHDL", "Verilog", "Matlab", "Solidity", "SQL", "PL/SQL", "T-SQL", "C", "C++", "Objective-C", "Assembly", "COBOL", "Fortran", "Pascal", "Ada", "Lisp", "Prolog", "Smalltalk", "Forth", "Erlang", "Bash", "Shell", "PowerShell", "Batch", "Groovy", "Racket", "Kotlin", "D", "Dylan", "F#", "OCaml", "Standard ML", "Go", "Crystal", "Nim","Node"],
  "Frameworks": ["React", "Angular", "Vue", "Django", "Flask", "Laravel", ".NET", "Spring", "Express", "Svelte", "Ruby on Rails", "Next.js", "Nuxt.js", "Gatsby", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright", "Symfony", "NextJS", "NuxtJS"],
  "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB"],
  "Technologies": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "WebSockets", "Elastic"],
};

// Flatten and lowercase the keywords for easier comparison
const flattenedKeywords = Object.values(keywordsList).flat().map(keyword => keyword.toLowerCase());

const Editor: React.FC = () => {
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  const [normalizedWords, setNormalizedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [highlightedKeywords, setHighlightedKeywords] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedText = sessionStorage.getItem('fileContent');
    if (storedText) {
      // Split the text into words, considering punctuation and special characters
      const wordsArray = storedText.match(/[\w]+|\/|[^\w\s]/g) || [];
      setOriginalWords(wordsArray);
      console.log(`Original words: ${wordsArray}`);
  
      // Normalize originalWords for keyword checking
      // This involves creating a parallel array where each word is normalized
      const normalizedWordsArray = wordsArray.map(word => 
        word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      );
      console.log(`Normalized words: ${normalizedWordsArray}`);
  
      // Use normalizedWordsArray for keyword matching but maintain originalWords for display
      setNormalizedWords(normalizedWordsArray);
    }
  }, []);
  


  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (originalWords.length > 0 && normalizedWords.length > 0) {
      interval = setInterval(() => {
        setCurrentWordIndex(prevIndex => {
          const nextIndex = prevIndex + 1;

          if (nextIndex < originalWords.length) {
            if (flattenedKeywords.includes(normalizedWords[nextIndex])) {
              setHighlightedKeywords(prev => new Set(prev).add(nextIndex));
            }
            return nextIndex;
          } else {
            // Additional logic to handle the last word
            setTimeout(() => {
              // Only remove the highlight if the last word is not a keyword
              if (!flattenedKeywords.includes(normalizedWords[originalWords.length - 1])) {
                setCurrentWordIndex(-1); // Reset currentWordIndex to remove highlight
              }
            }, 125); // Delay to briefly show the last word as read
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 125);

      return () => clearInterval(interval);
    }
  }, [originalWords, normalizedWords]);

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
      {originalWords.map((word, index) => {
        const isCurrentWord = index === currentWordIndex;
        const isKeywordHighlighted = highlightedKeywords.has(index);
        return (
          <span key={index} style={{ display: 'inline-block', marginRight: '5px' }}>
            {isCurrentWord && (
              <RoughNotation type="highlight" show={true} color="#FFD700" animate={false}>
                {word}
              </RoughNotation>
            )}
            {!isCurrentWord && isKeywordHighlighted && (
              <RoughNotation type="highlight" show={true} color="#FFD700" animate={false}>
                {word}
              </RoughNotation>
            )}
            {!isCurrentWord && !isKeywordHighlighted && word}
          </span>
        );
      })}
    </div>
  );
};

export default Editor;
