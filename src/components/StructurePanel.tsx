import React, { useMemo } from 'react';
import { parseRegex, getQuantifierLabel } from '../utils/regexParser';
import { RegexNode } from '../types';
import { GitBranchIcon, BoxIcon, TypeIcon, AnchorIcon } from './Icons';

interface StructurePanelProps {
  currentPattern: string;
}

const NodeView: React.FC<{ node: RegexNode }> = ({ node }) => {
    const isAlternation = node.type === 'alternation';
    const hasChildren = node.children && node.children.length > 0;
    const quantifierLabel = getQuantifierLabel(node.quantifier);

    const getNodeColor = (type: string) => {
        switch(type) {
            case 'assertion': return 'bg-cyber-accent/20 border-cyber-accent text-cyber-accent';
            case 'group': return 'bg-cyber-secondary/10 border-cyber-secondary text-cyber-secondary dashed-border';
            case 'class': return 'bg-cyber-success/10 border-cyber-success text-cyber-success';
            case 'alternation': return 'bg-cyber-warning/20 border-cyber-warning text-cyber-warning';
            default: return 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary';
        }
    };

    const getNodeIcon = (type: string) => {
        switch(type) {
            case 'assertion': return <AnchorIcon className="w-3 h-3" />;
            case 'group': return <BoxIcon className="w-3 h-3" />;
            case 'alternation': return <GitBranchIcon className="w-3 h-3" />;
            default: return <TypeIcon className="w-3 h-3" />;
        }
    };

    if (isAlternation) {
        return (
            <div className="flex flex-col justify-center items-center px-2 connector-line">
                <div className="w-6 h-6 rounded-full bg-cyber-warning/20 border border-cyber-warning flex items-center justify-center mb-1">
                    <span className="text-[10px] font-bold text-cyber-warning">OR</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center group relative connector-line ${node.quantifier ? 'mt-4' : ''}`}>

            {/* Quantifier Badge */}
            {node.quantifier && (
                <div className="absolute -top-5 text-[10px] bg-cyber-dark border border-gray-700 px-2 py-0.5 rounded-full text-gray-400 whitespace-nowrap z-10">
                    {quantifierLabel} ({node.quantifier})
                </div>
            )}

            <div className={`
                relative flex flex-col items-center
                border rounded-lg p-3 min-w-[80px]
                transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]
                ${getNodeColor(node.type)}
                ${node.type === 'group' ? 'border-dashed' : ''}
            `}>
                <div className="flex items-center gap-2 mb-1 opacity-70">
                    {getNodeIcon(node.type)}
                    <span className="text-[10px] uppercase font-bold tracking-wider">{node.type}</span>
                </div>

                <div className="font-mono text-sm font-bold bg-black/20 px-2 py-1 rounded min-w-[20px] text-center">
                    {node.value}
                </div>

                {hasChildren && (
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/10 justify-center bg-black/10 rounded w-full">
                        {node.children?.map((child, idx) => (
                            <NodeView key={idx} node={child} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StructurePanel: React.FC<StructurePanelProps> = ({ currentPattern }) => {
  const nodes = useMemo(() => parseRegex(currentPattern), [currentPattern]);

  return (
    <div className="glass-panel rounded-xl h-full flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-cyber-panel">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <BoxIcon className="w-4 h-4 text-cyber-primary" />
                Structural Visualization
            </h2>
            <div className="text-[10px] text-gray-600 font-mono border border-gray-800 px-2 py-1 rounded">
                SCHEMA MODE
            </div>
        </div>

        {/* Visualization Canvas */}
        <div className="flex-grow overflow-auto custom-scrollbar p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-10"
                 style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>

            <div className="relative z-10 flex items-center min-w-max min-h-full justify-center">
                {/* Start Node */}
                <div className="flex flex-col items-center mr-4 connector-line">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] mb-2"></div>
                    <span className="text-[10px] text-gray-500">BEGIN</span>
                </div>

                {/* Nodes Flow */}
                <div className="flex items-start gap-4">
                    {nodes.map((node, idx) => (
                        <NodeView key={idx} node={node} />
                    ))}
                    {nodes.length === 0 && (
                         <div className="text-gray-600 italic">Empty Pattern</div>
                    )}
                </div>

                {/* End Node */}
                <div className="flex flex-col items-center ml-4">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] mb-2"></div>
                    <span className="text-[10px] text-gray-500">END</span>
                </div>
            </div>
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-white/5 bg-cyber-panel text-[10px] text-gray-500 flex gap-4 justify-center">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyber-primary/50"></span> Literal</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyber-secondary/50 border border-dashed border-white/20"></span> Group</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyber-success/50"></span> Class</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyber-accent/50"></span> Anchor</div>
        </div>
    </div>
  );
};

export default StructurePanel;
