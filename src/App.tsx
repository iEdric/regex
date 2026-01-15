import React, { useState } from 'react';
import RegexEditor from './components/RegexEditor';
import MatchViewer from './components/MatchViewer';
import StructurePanel from './components/StructurePanel';
import { RegexFlag } from './types';
import { BoxIcon } from './components/Icons';

const App = () => {
  const [pattern, setPattern] = useState(String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`);
  const [flags, setFlags] = useState<RegexFlag[]>([RegexFlag.Global, RegexFlag.IgnoreCase]);
  const [testString, setTestString] = useState('Contact support@example.com for assistance.\nOr email sales-team@corp.net today!');

  return (
    <div className="min-h-screen bg-cyber-dark text-white font-sans selection:bg-cyber-primary/30 selection:text-white pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-cyber-secondary to-cyber-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <span className="font-mono font-bold text-black text-lg">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                RegEx<span className="text-cyber-primary">.Visualizer</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 hidden sm:block font-mono">V 1.0.0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Editor Section */}
        <section>
          <RegexEditor 
            pattern={pattern} 
            flags={flags} 
            onPatternChange={setPattern}
            onFlagsChange={setFlags}
          />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          
          {/* Left: Test String Visualizer */}
          <div className="lg:col-span-5 h-[500px] lg:h-full">
            <MatchViewer 
              text={testString}
              pattern={pattern}
              flags={flags}
              onTextChange={setTestString}
            />
          </div>

          {/* Right: Structure Panel */}
          <div className="lg:col-span-7 h-full">
            <StructurePanel currentPattern={pattern} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm mt-12 font-mono">
        <p>CYBERPUNK REGEX VISUALIZATION</p>
      </footer>
    </div>
  );
};

export default App;