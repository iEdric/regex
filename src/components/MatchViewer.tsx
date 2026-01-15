import React, { useMemo } from 'react';
import { calculateMatches } from '../utils/regexUtils';
import { RegexFlag } from '../types';

interface MatchViewerProps {
  text: string;
  pattern: string;
  flags: RegexFlag[];
  onTextChange: (text: string) => void;
}

const MatchViewer: React.FC<MatchViewerProps> = ({ text, pattern, flags, onTextChange }) => {
  const segments = useMemo(() => calculateMatches(text, pattern, flags), [text, pattern, flags]);

  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col h-full relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-20 group-hover:opacity-50 transition-opacity"></div>

        <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm uppercase tracking-widest text-cyber-primary font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse"></span>
                Test String
            </h2>
            <div className="text-xs text-gray-500 font-mono">
                {segments.filter(s => s.isMatch).length} matches found
            </div>
        </div>

      <div className="relative flex-grow font-mono text-sm leading-relaxed overflow-hidden rounded-lg bg-cyber-dark border border-cyber-border">
        {/* Mirror div for highlighting - sits behind the textarea */}
        <div className="absolute inset-0 p-4 whitespace-pre-wrap break-all pointer-events-none text-transparent overflow-auto custom-scrollbar z-0">
          {segments.map((seg) => (
            <span
              key={seg.id}
              className={seg.isMatch
                ? "bg-cyber-primary/20 text-transparent border-b-2 border-cyber-primary shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                : ""}
            >
              {seg.text}
            </span>
          ))}
        </div>

        {/* Actual editable textarea */}
        <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent p-4 text-gray-300 resize-none outline-none z-10 font-mono whitespace-pre-wrap break-all selection:bg-cyber-secondary/30 focus:ring-1 focus:ring-cyber-primary/30 transition-shadow"
            spellCheck={false}
            placeholder="Type your test string here..."
        />
      </div>
    </div>
  );
};

export default MatchViewer;
