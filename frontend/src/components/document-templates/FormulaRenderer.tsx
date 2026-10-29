import React from 'react';

export interface FormulaRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Universal Formula & Text Renderer for Physics, Chemistry, Biology & Mathematics
 * Parses superscripts, subscripts, fractions, square roots, Greek/scientific symbols,
 * and chemical reaction equations into clean print-ready typography.
 */
export const FormulaRenderer: React.FC<FormulaRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  // Render text segment with math, chemistry, and sub/superscript parsing
  const formatSegment = (text: string): React.ReactNode => {
    // 1. Check for LaTeX-like fractions: \frac{num}{den}
    if (text.includes('\\frac')) {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/;

      let keyIdx = 0;
      while (remaining.length > 0) {
        const match = fracRegex.exec(remaining);
        if (!match) {
          parts.push(parseSubSuperscripts(remaining, `tail-${keyIdx}`));
          break;
        }

        const matchIndex = match.index;
        if (matchIndex > 0) {
          parts.push(parseSubSuperscripts(remaining.slice(0, matchIndex), `head-${keyIdx}`));
        }

        const numerator = match[1];
        const denominator = match[2];
        parts.push(
          <span
            key={`frac-${keyIdx}`}
            className="inline-flex flex-col items-center align-middle mx-1 text-[0.9em] leading-none"
            style={{ display: 'inline-flex', verticalAlign: 'middle' }}
          >
            <span className="border-b border-current px-1 text-center font-serif italic pb-0.5">
              {formatSegment(numerator)}
            </span>
            <span className="px-1 text-center font-serif italic pt-0.5">
              {formatSegment(denominator)}
            </span>
          </span>
        );

        remaining = remaining.slice(matchIndex + match[0].length);
        keyIdx++;
      }
      return <>{parts}</>;
    }

    return parseSubSuperscripts(text, 'root');
  };

  // Helper to parse superscripts, subscripts, roots, and common scientific tokens
  const parseSubSuperscripts = (str: string, baseKey: string): React.ReactNode => {
    // Replace standard symbols & arrows
    let formatted = str
      .replace(/\\pi/g, 'π')
      .replace(/\\theta/g, 'θ')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\Omega/g, 'Ω')
      .replace(/\\Sigma/g, 'Σ')
      .replace(/\\approx/g, '≈')
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\rightarrow|-->|->/g, ' → ')
      .replace(/\\uparrow/g, ' ↑ ')
      .replace(/\\downarrow/g, ' ↓ ')
      .replace(/\\leftrightarrow|<->/g, ' ⇄ ');

    // Handle square roots: \sqrt{x}
    if (formatted.includes('\\sqrt')) {
      const parts: React.ReactNode[] = [];
      const sqrtRegex = /\\sqrt\{([^{}]+)\}/;
      let rem = formatted;
      let sIdx = 0;
      while (rem.length > 0) {
        const m = sqrtRegex.exec(rem);
        if (!m) {
          parts.push(renderSubSuperscriptTokens(rem, `${baseKey}-srem-${sIdx}`));
          break;
        }
        if (m.index > 0) {
          parts.push(renderSubSuperscriptTokens(rem.slice(0, m.index), `${baseKey}-spre-${sIdx}`));
        }
        parts.push(
          <span key={`${baseKey}-sqrt-${sIdx}`} className="inline-flex items-center mx-0.5 font-serif">
            <span className="text-base font-normal">√</span>
            <span className="border-t border-current px-0.5 text-[0.95em]">{m[1]}</span>
          </span>
        );
        rem = rem.slice(m.index + m[0].length);
        sIdx++;
      }
      return <>{parts}</>;
    }

    return renderSubSuperscriptTokens(formatted, baseKey);
  };

  // Parses tokens like x^2, x^{10}, H_2O, CO_2, Fe^{2+}, SO_4^{2-}
  const renderSubSuperscriptTokens = (text: string, keyPrefix: string): React.ReactNode => {
    // Regex for:
    // 1) Superscript: ^\{([^{}]+)\} or \^([0-9a-zA-Z\+\-]+)
    // 2) Subscript: _\{([^{}]+)\} or _([0-9a-zA-Z\+\-]+)
    const tokenRegex = /(\^\{[^{}]+\}|\^[0-9a-zA-Z\+\-]+|_\{[^{}]+\}|_[0-9a-zA-Z\+\-]+)/g;
    const pieces = text.split(tokenRegex);

    return pieces.map((piece, idx) => {
      if (!piece) return null;
      if (piece.startsWith('^{') && piece.endsWith('}')) {
        return <sup key={`${keyPrefix}-sup-${idx}`} className="text-[0.75em] leading-none font-semibold">{piece.slice(2, -1)}</sup>;
      }
      if (piece.startsWith('^')) {
        return <sup key={`${keyPrefix}-sup-${idx}`} className="text-[0.75em] leading-none font-semibold">{piece.slice(1)}</sup>;
      }
      if (piece.startsWith('_{') && piece.endsWith('}')) {
        return <sub key={`${keyPrefix}-sub-${idx}`} className="text-[0.75em] leading-none font-semibold">{piece.slice(2, -1)}</sub>;
      }
      if (piece.startsWith('_')) {
        return <sub key={`${keyPrefix}-sub-${idx}`} className="text-[0.75em] leading-none font-semibold">{piece.slice(1)}</sub>;
      }
      return <span key={`${keyPrefix}-txt-${idx}`}>{piece}</span>;
    });
  };

  // If text contains newlines, split by line break
  const lines = content.split('\n');

  if (inline) {
    return (
      <span className={`formula-content ${className}`}>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {formatSegment(line)}
          </React.Fragment>
        ))}
      </span>
    );
  }

  return (
    <div className={`formula-content leading-relaxed ${className}`}>
      {lines.map((line, lIdx) => (
        <div key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
          {formatSegment(line)}
        </div>
      ))}
    </div>
  );
};
