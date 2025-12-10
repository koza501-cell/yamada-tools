'use client';

import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const htmlContent = marked.parse(content.trim());
    setHtml(htmlContent as string);
  }, [content]);

  if (!html) {
    return <div>Loading content...</div>;
  }

  return (
    <div 
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
