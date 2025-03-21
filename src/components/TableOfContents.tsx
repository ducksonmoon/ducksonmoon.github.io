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
    <div className="toc-container my-6 p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#6d28d9]">
        Table of Contents
      </h2>
      <div className="h-px w-full bg-gradient-to-r from-gray-700 via-primary/30 to-gray-700 mb-4"></div>
      <nav aria-label="Table of contents">
        <ul className="space-y-3">
          {headings.map((item, index) => (
            <li 
              key={index} 
              className={`
                ${item.level === 1 
                  ? 'mb-2' 
                  : item.level === 2 
                    ? 'ml-3' 
                    : 'ml-6'
                }
              `}
            >
              <a 
                href={`#${item.id}`}
                className={`
                  group block transition-all duration-200 hover:translate-x-1
                  ${item.level === 1 
                    ? 'text-white font-medium text-[1rem]' 
                    : item.level === 2 
                      ? 'text-gray-200 text-[0.95rem]' 
                      : 'text-gray-400 text-[0.9rem]'
                  } hover:text-primary
                `}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}; 