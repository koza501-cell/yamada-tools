'use client';
import { useEffect, useRef } from 'react';
import { marked } from 'marked';

export default function BlogContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent?.includes('[IMAGE:')) {
          p.style.display = 'none';
        }
      });
    }
  }, [content]);

  const renderContent = async () => {
    const html = await marked(content);
    return html;
  };

  return (
    <div 
      ref={contentRef}
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
