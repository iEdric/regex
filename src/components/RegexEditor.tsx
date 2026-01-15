import React from 'react';
import { RegexFlag } from '../types';
import { isValidRegex } from '../utils/regexUtils';

interface RegexEditorProps {
  pattern: string;
  flags: RegexFlag[];
  onPatternChange: (pattern: string) => void;
  onFlagsChange: (flags: RegexFlag[]) => void;
}

const RegexEditor: React.FC<RegexEditorProps> = ({ pattern, flags, onPatternChange, onFlagsChange }) => {

  const toggleFlag = (flag: RegexFlag) => {
    if (flags.includes(flag)) {
      onFlagsChange(flags.filter(f => f !== flag));
    } else {
      onFlagsChange([...flags, flag]);
    }
  };

  const valid = isValidRegex(pattern);

  return (
    <div className="glass-panel rounded-xl p-6 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-grow w-full">
            <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Regular Expression</label>
            <div className={`relative flex items-center bg-cyber-dark border rounded-lg transition-all duration-300 ${valid ? 'border-cyber-border focus-within:border-cyber-primary focus-within:shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-cyber-accent focus-within:shadow-[0_0_15px_rgba(255,0,60,0.2)]'}`}>
                <span className="pl-4 text-gray-500 font-mono text-lg select-none">/</span>
                <input
                    type="text"
                    value={pattern}
                    onChange={(e) => onPatternChange(e.target.value)}
                    className="w-full bg-transparent border-none text-white font-mono text-lg p-3 focus:ring-0 placeholder-gray-700"
                    placeholder="e.g. [a-z0-9._%+-]+"
                />
                <span className="pr-4 text-gray-500 font-mono text-lg select-none">/</span>
            </div>
            {!valid && pattern.length > 0 && (
                <div className="text-cyber-accent text-xs mt-2 flex items-center gap-1">
                    Invalid Regex Pattern
                </div>
            )}
        </div>

        <div className="w-full md:w-auto">
            <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Flags</label>
            <div className="flex flex-wrap gap-2">
                {Object.values(RegexFlag).map((flag) => (
                    <button
                        key={flag}
                        onClick={() => toggleFlag(flag)}
                        className={`
                            px-3 py-2 rounded-md font-mono text-sm border transition-all duration-200
                            ${flags.includes(flag)
                                ? 'bg-cyber-secondary/20 border-cyber-secondary text-cyber-secondary shadow-[0_0_8px_rgba(112,0,255,0.3)]'
                                : 'bg-transparent border-cyber-border text-gray-500 hover:border-gray-400'}
                        `}
                        title={flag}
                    >
                        {flag}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegexEditor;
