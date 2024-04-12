"use client"

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ProgressBar } from "@/components/progress-bar"
import { Badge } from "@/components/ui/badge"

const keywordsList = {
    "Programming Languages": ["Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Golang", "TypeScript", "Swift", "Kotlin", "NodeJS", "Node.js", "Rust", "Scala", "Perl", "Haskell", "Clojure", "Elixir", "Lua", "Dart", "Julia", "R", "VHDL", "Verilog", "Matlab", "Solidity", "SQL", "PL/SQL", "T-SQL", "C", "C++", "Objective-C", "Assembly", "COBOL", "Fortran", "Pascal", "Ada", "Lisp", "Prolog", "Smalltalk", "Forth", "Erlang", "Bash", "Shell", "PowerShell", "Batch", "Groovy", "Racket", "Kotlin", "D", "Dylan", "F#", "OCaml", "Standard ML", "Go", "Crystal", "Nim"],
    "Frameworks": ["React", "Angular", "Vue", "Django", "Flask", "Laravel", ".NET", "Spring", "Express", "Svelte", "Ruby on Rails", "Next.js", "Nuxt.js", "Gatsby", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Puppeteer", "Playwright", "Symfony", "NextJS", "NuxtJS"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "DynamoDB", "Postgres", "BigQuery", "Mongo DB"],
    "Technologies": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "WebSockets", "Elastic", "Lambda", "S3", "Kinesis", "RDS", "Step Functions", "Appflow","Serverless","Heroku", "GitHub", "CircleCI","Graphite", "Grafana", "Splunk","RESTful APIs", "RESTful API", "REST APIs", "REST API", "CloudFormation", "CloudWatch", "JSForce"],
    "Concepts": ["Functional Programming"],
    "Tools": ["Postman"]
};

const escapeRegExp = (str: string) => {
    // Escape special characters for use in a regular expression
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
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
        editable: false, 
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

    const handleKeywordClick = (keyword: string) => {
        const newKeywords = highlightedKeywords.filter(k => k !== keyword);
        setHighlightedKeywords(newKeywords);
        updateEditorContent(keyword);
    };

    const updateEditorContent = (keyword: string) => {
        let updatedContent = content;
        
        const regex = new RegExp(`<mark>${keyword}</mark>`, 'gi');
        updatedContent = updatedContent.replace(regex, keyword);
        setContent(updatedContent);
        
        if (editor) {
            editor.commands.setContent(updatedContent);
        }
    };

    if (!editor) {
        return <p>Loading...</p>; // <ProgressBar />
    }

    return (
        <>
            <div className="container relative">
                <section>
                    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
                        {/* Header Section */}
                        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                            <h2 className="text-lg font-semibold">Playground</h2>
                        </div>

                        {/* Content Section */}
                        <div className="container h-full py-6">
                            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
                                <div className="flex-col space-y-4 sm:flex md:order-2">
                                    <div className="grid gap-2">
                                        <ul>
                                            {highlightedKeywords.map((keyword, index) => (
                                                <li key={index} onClick={() => handleKeywordClick(keyword)}>
                                                    <HoverCard openDelay={200}>
                                                        <HoverCardTrigger asChild>
                                                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                <Badge>{keyword}</Badge>
                                                            </span>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-[140px] text-sm" side="left">
                                                            tap to remove
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex h-full flex-col space-y-4 md:order-1">
                                    {/* Editor Component */}
                                    <EditorContent
                                        editor={editor}
                                        className="flex min-h-[60px] w-full flex-1 rounded-md border border-input bg-transparent p-4 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[700px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default EditorPage;

