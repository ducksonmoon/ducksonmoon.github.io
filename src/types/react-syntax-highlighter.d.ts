declare module "react-syntax-highlighter" {
  import * as React from "react";

  interface SyntaxHighlighterProps {
    language?: string;
    style?: Record<string, any>;
    children: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    lineProps?: Record<string, any>;
    customStyle?: React.CSSProperties;
  }

  export class Prism extends React.Component<SyntaxHighlighterProps> {}
  export class Light extends React.Component<SyntaxHighlighterProps> {}
}
