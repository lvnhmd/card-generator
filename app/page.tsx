"use client"

import React from 'react'; // Add this line
import { useState } from 'react';
import Link from 'next/link';
// Import l-mammoth directly
import * as LMammoth from 'l-mammoth';

const Home: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined' && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await file.arrayBuffer();
      // Use l-mammoth here
      LMammoth.convertToHtml({ arrayBuffer })
        .then((result: { value: string }) => {
          setFileContent(result.value);
          sessionStorage.setItem('fileContent', result.value);
        })
        .catch((err: Error) => console.error(err));
    } else {
      // Handle unsupported file types or server-side execution
      console.error("Unsupported file type or not in a browser environment");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".docx" />
      {fileContent && (
        <Link href="/editor">Go</Link>
      )}
    </div>
  );
};

export default Home;
