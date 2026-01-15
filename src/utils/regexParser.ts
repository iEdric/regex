import { RegexNode } from '../types';

export function parseRegex(pattern: string): RegexNode[] {
    let i = 0;
    
    function parseSequence(stopChars: string[]): RegexNode[] {
        const nodes: RegexNode[] = [];
        
        while (i < pattern.length) {
            const char = pattern[i];
            
            if (stopChars.includes(char)) {
                return nodes;
            }
            
            if (char === '(') {
                i++;
                let isCapturing = true;
                if (pattern[i] === '?' && pattern[i+1] === ':') {
                    isCapturing = false;
                    i += 2;
                }
                const children = parseSequence([')']);
                nodes.push({ type: 'group', value: 'Group', children, isCapturing });
                i++; // skip )
            } else if (char === '[') {
                let cls = '[';
                i++;
                while (i < pattern.length) {
                    if (pattern[i] === ']') {
                        cls += ']';
                        break;
                    }
                    if (pattern[i] === '\\') {
                        cls += pattern[i] + (pattern[i+1] || '');
                        i += 2;
                    } else {
                        cls += pattern[i];
                        i++;
                    }
                }
                i++; // skip ]
                nodes.push({ type: 'class', value: cls });
            } else if (char === '|') {
                nodes.push({ type: 'alternation', value: 'OR' });
                i++;
            } else if (['*', '+', '?', '{'].includes(char)) {
                // Quantifier
                let quant = char;
                i++;
                if (char === '{') {
                    while (i < pattern.length && pattern[i] !== '}') {
                        quant += pattern[i];
                        i++;
                    }
                    quant += '}';
                    i++;
                }
                // Attach to previous node
                if (nodes.length > 0) {
                    const last = nodes[nodes.length - 1];
                    last.quantifier = (last.quantifier || '') + quant;
                }
            } else if (char === '\\') {
                 // Escape sequence
                 nodes.push({ type: 'literal', value: pattern.substring(i, i+2) });
                 i += 2;
            } else if (['^', '$'].includes(char)) {
                 nodes.push({ type: 'assertion', value: char === '^' ? 'Start' : 'End' });
                 i++;
            } else if (char === '.') {
                 nodes.push({ type: 'class', value: 'Any Char' });
                 i++;
            } else {
                 // Literal
                 // Merge consecutive literals for display
                 if (nodes.length > 0 && nodes[nodes.length-1].type === 'literal' && !nodes[nodes.length-1].quantifier) {
                     nodes[nodes.length-1].value += char;
                 } else {
                     nodes.push({ type: 'literal', value: char });
                 }
                 i++;
            }
        }
        return nodes;
    }

    // Wrap top level in a sequence if needed, but for now just return list
    try {
        return parseSequence([]);
    } catch (e) {
        console.error("Parse error", e);
        return [{ type: 'literal', value: pattern }];
    }
}

export function getQuantifierLabel(q: string | undefined): string {
    if (!q) return '';
    if (q === '*') return '0 or more';
    if (q === '+') return '1 or more';
    if (q === '?') return '0 or 1';
    return q.replace('{', '').replace('}', ' times');
}
