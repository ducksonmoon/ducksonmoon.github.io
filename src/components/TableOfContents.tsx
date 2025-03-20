import React from 'react';

interface TableOfContentsProps {
  content: string;
}

// This is the placeholder text that users can add to their markdown
export const TOC_PLACEHOLDER = '{toc}';

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  // Extract all headings (# Heading) from the content
  const headingRegex = /^(#{1,3})\s+(.*)$/gm;
  let match;
  const headings: { level: number; text: string; id: string }[] = [];
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '').trim();
    
    // Create an ID from the heading text
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ level, text, id });
  }

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="toc-container my-6 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((item, index) => (
          <li 
            key={index} 
            className={`${
              item.level === 1 
                ? '' 
                : item.level === 2 
                  ? 'ml-4' 
                  : 'ml-8'
            }`}
          >
            <a 
              href={`#${item.id}`} 
              className="text-primary hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}; 