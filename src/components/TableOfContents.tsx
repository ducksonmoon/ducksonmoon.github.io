import React, { useEffect, useState } from 'react';

interface TableOfContentsProps {
  content: string;
}

// This is the placeholder text that users can add to their markdown
export const TOC_PLACEHOLDER = '{toc}';

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [activeId, setActiveId] = useState<string>('');
  
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

  // Set up intersection observer to highlight active section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    
    // Observe all section headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  // Check if we're in light mode
  const isDarkMode = 
    typeof window !== 'undefined' && 
    document.querySelector('.light-mode') === null;

  return (
    <nav className="toc-container" aria-label="Table of contents">
      <ul className="toc-list" style={{ listStyle: 'none', marginLeft: 0 }}>
        {headings.map((item, index) => {
          const isActive = activeId === item.id;
          
          return (
            <li 
              key={index} 
              className={`
                toc-item
                ${item.level === 1 ? 'toc-level-1' : item.level === 2 ? 'toc-level-2' : 'toc-level-3'}
                ${isActive ? 'toc-active' : ''}
              `}
              style={{ 
                paddingLeft: `${(item.level - 1) * 1}rem`,
                marginBottom: item.level === 1 ? '0.75rem' : '0.5rem',
                listStyleType: 'none'
              }}
            >
              <a 
                href={`#${item.id}`}
                className={`
                  toc-link
                  ${isActive ? 'toc-link-active' : ''}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    window.scrollTo({
                      top: element.getBoundingClientRect().top + window.pageYOffset - 100,
                      behavior: 'smooth'
                    });
                    setActiveId(item.id);
                  }
                }}
              >
                <span className="toc-bullet" role="presentation"></span>
                <span className="toc-text">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}; 