"use client"
import { useEffect, useState } from 'react';
import { RoughNotation } from "react-rough-notation";

const keywordsList = {
  "Programming Languages": ["Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Golang", "TypeScript", "Swift", "Kotlin"],
  "Frameworks": ["React", "Angular", "Vue", "Django", "Flask", "Laravel", ".NET", "Spring", "Express"],
  "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB"],
  "Technologies": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "WebSockets"],
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
        // Split the original text into words for display without removing punctuation
        const wordsArray = storedText.split(/\s+/);
        setOriginalWords(wordsArray);

        // Create a normalized version of the text for keyword checking
        // This involves removing punctuation and handling paired keywords
        const normalizedText = storedText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        const normalizedWordsArray = normalizedText.split(/\s+|\/+/);
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
