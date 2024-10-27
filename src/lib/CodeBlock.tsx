"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error
// react-syntax-highlighter is JS Lib
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = className?.replace("language-", "") || "";

  const handleCopy = () => {
    if (children) {
      navigator.clipboard.writeText(String(children)).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (inline) {
    return (
      <code className="bg-gray-800 text-white px-1 rounded">{children}</code>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
      >
        {isCopied ? (
          <CheckIcon className="h-5 w-5 text-green-400" />
        ) : (
          <ClipboardIcon className="h-5 w-5" />
        )}
      </button>

      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#1e1e1e",
        }}
        showLineNumbers
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};
