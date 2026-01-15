import { MatchSegment, RegexFlag } from '../types';

export const calculateMatches = (
  text: string,
  pattern: string,
  flags: RegexFlag[]
): MatchSegment[] => {
  if (!pattern || !text) return [{ text, isMatch: false, id: 'nomatch' }];

  const flagString = Array.from(new Set(flags)).join(''); // Ensure unique flags

  try {
    const regex = new RegExp(pattern, flagString);
    const segments: MatchSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Handle global flag properly
    if (!flags.includes(RegexFlag.Global)) {
        match = regex.exec(text);
        if (match) {
            if (match.index > 0) {
                segments.push({
                    text: text.substring(0, match.index),
                    isMatch: false,
                    id: `pre-${match.index}`
                });
            }
            segments.push({
                text: match[0],
                isMatch: true,
                id: `match-${match.index}`
            });
            if (match.index + match[0].length < text.length) {
                segments.push({
                    text: text.substring(match.index + match[0].length),
                    isMatch: false,
                    id: `post-${match.index}`
                });
            }
        } else {
             segments.push({ text, isMatch: false, id: 'nomatch' });
        }
        return segments;
    }

    // Global match loop
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.index),
          isMatch: false,
          id: `no-${lastIndex}`,
        });
      }

      segments.push({
        text: match[0],
        isMatch: true,
        id: `yes-${match.index}`,
      });

      lastIndex = match.index + match[0].length;

      // Prevent infinite loops with zero-width matches (e.g. pattern "")
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isMatch: false,
        id: `end-${lastIndex}`,
      });
    }

    return segments.length > 0 ? segments : [{ text, isMatch: false, id: 'nomatch' }];

  } catch (e) {
    console.error("Invalid Regex", e);
    return [{ text, isMatch: false, id: 'error' }];
  }
};

export const isValidRegex = (pattern: string): boolean => {
    try {
        new RegExp(pattern);
        return true;
    } catch {
        return false;
    }
}
