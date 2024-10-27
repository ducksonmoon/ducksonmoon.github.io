declare module "react-syntax-highlighter" {
  import * as React from "react";

  interface SyntaxHighlighterProps {
    language?: string;
    style?: React.CSSProperties | Record<string, unknown>;
    children: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    lineProps?: React.HTMLProps<HTMLDivElement>; // Replacing Record with a more specific type
    customStyle?: React.CSSProperties;
  }

  export class Prism extends React.Component<SyntaxHighlighterProps> {}
  export class Light extends React.Component<SyntaxHighlighterProps> {}
}
