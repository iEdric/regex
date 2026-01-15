
export enum RegexFlag {
  Global = 'g',
  IgnoreCase = 'i',
  Multiline = 'm',
  SingleLine = 's',
  Unicode = 'u',
  Sticky = 'y',
}

export interface RegexState {
  pattern: string;
  flags: RegexFlag[];
}

export interface MatchSegment {
  text: string;
  isMatch: boolean;
  id: string;
}

// Parser Types
export type NodeType = 'group' | 'class' | 'literal' | 'alternation' | 'assertion' | 'sequence';

export interface RegexNode {
  type: NodeType;
  value: string;
  children?: RegexNode[];
  quantifier?: string;
  isCapturing?: boolean;
  raw?: string;
}

// AI Types
export interface ExplanationPart {
  segment: string;
  description: string;
  type: 'anchor' | 'quantifier' | 'group' | 'class' | 'literal' | 'special';
}

export interface AiResponse {
  error?: string;
  explanation?: ExplanationPart[];
  generatedPattern?: string;
}
