"use client"

import { useEffect, useState } from 'react';
import { RoughNotation } from "react-rough-notation";

const Editor: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1); // Start before the first word
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);

  useEffect(() => {
    const storedText = sessionStorage.getItem('fileContent');
    if (storedText) {
      const wordsArray = storedText.split(/\s+/);
      setWords(wordsArray);
    }
  }, []);

  useEffect(() => {
    // Proceed if there are words to display
    if (words.length > 0) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < words.length) {
            setShowAnnotation(true); // Show annotation for the next word
            return nextIndex;
          } else {
            // Once the end is reached, hide the annotation after a delay
            setTimeout(() => setShowAnnotation(false), 250); // Adjust delay as needed
            clearInterval(interval); // Stop the interval
            return prevIndex; // Keep the index at the last word without incrementing
          }
        });
      }, 250); // Interval for moving to the next word

      return () => clearInterval(interval);
    }
  }, [words]);

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
      {words.map((word, index) => (
        <span key={index}>
          {index === currentWordIndex && showAnnotation ? (
            <RoughNotation type="box" show={true} color="#FFD700" animate={false}>
              {word}
            </RoughNotation>
          ) : (
            word
          )}
          {' '}
        </span>
      ))}
    </div>
  );
};

export default Editor;