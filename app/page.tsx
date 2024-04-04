"use client"

import { useState } from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const text = await file.text();
      setFileContent(text);
      sessionStorage.setItem('fileContent', text);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".txt" />
      {fileContent && (
        <Link href="/editor">
          Go
        </Link>
      )}
    </div>
  );
};

export default Home;
