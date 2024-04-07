"use client"

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'

const keywordsList = {
    "Programming Languages": ["Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Golang", "TypeScript", "Swift", "Kotlin", "NodeJS", "Node.js", "Rust", "Scala", "Perl", "Haskell", "Clojure", "Elixir", "Lua", "Dart", "Julia", "R", "VHDL", "Verilog", "Matlab", "Solidity", "SQL", "PL/SQL", "T-SQL", "C", "C++", "Objective-C", "Assembly", "COBOL", "Fortran", "Pascal", "Ada", "Lisp", "Prolog", "Smalltalk", "Forth", "Erlang", "Bash", "Shell", "PowerShell", "Batch", "Groovy", "Racket", "Kotlin", "D", "Dylan", "F#", "OCaml", "Standard ML", "Go", "Crystal", "Nim"],
    "Frameworks": ["React", "Angular", "Vue", "Django", "Flask", "Laravel", ".NET", "Spring", "Express", "Svelte", "Ruby on Rails", "Next.js", "Nuxt.js", "Gatsby", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright", "Symfony", "NextJS", "NuxtJS"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB"],
    "Technologies": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "WebSockets", "Elastic"],
};

const escapeRegExp = (string) => {
    // Escape special characters for use in a regular expression
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const highlightKeywords = (htmlContent: string, keywordsList: Record<string, string[]>, keywordsFound: string[]): string => {
    let updatedContent = htmlContent;

    Object.values(keywordsList).flat().forEach((keyword) => {
        const escapedKeyword = escapeRegExp(keyword);
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        if (regex.test(updatedContent)) {
            keywordsFound.push(keyword); // Add keyword to the array if found
            updatedContent = updatedContent.replace(regex, `<mark>${keyword}</mark>`);
        }
    });

    return updatedContent;
};

const EditorPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [highlightedKeywords, setHighlightedKeywords] = useState<string[]>([]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
        ],
        content: '',
        editable: false, // Makes the editor read-only
    });

    useEffect(() => {
        const storedContent = sessionStorage.getItem('fileContent') || '<p>Edit your document here</p>';
        let keywordsFound: string[] = [];
        const highlightedContent = highlightKeywords(storedContent, keywordsList, keywordsFound);
        setContent(highlightedContent);
        setHighlightedKeywords(keywordsFound);

        if (editor) {
            editor.commands.setContent(highlightedContent);
        }
    }, [editor]);

    if (!editor) {
        return <p>Loading...</p>;
    }

    return (
        <div className="relative w-full max-w-screen-lg">
            <EditorContent editor={editor} className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg" />
            <div className="keywords-list">
            <h3>Highlighted Keywords:</h3>
            <ul>
                {highlightedKeywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default EditorPage;

