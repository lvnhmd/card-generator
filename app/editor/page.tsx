"use client"
// pages/editor.tsx
import { useEffect, useState } from 'react';
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

const Editor: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  useEffect(() => {
    const storedText = sessionStorage.getItem('fileContent');
    if (storedText) {
      // Split the stored text into words
      const wordsArray = storedText.split(/\s+/);
      setWords(wordsArray);
    }
  }, []);

  useEffect(() => {
    // Set an interval to update the currentWordIndex, simulating reading
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        // If we reach the end of the words array, start over
        if (prevIndex < words.length - 1) {
          return prevIndex + 1;
        } else {
          return 0; // Or stop the animation by clearing the interval
        }
      });
    }, 250); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, [words]);

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
      {/* Display the text with the current word highlighted */}
      {words.map((word, index) => (
        <span key={index}>
          {index === currentWordIndex ? (
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

