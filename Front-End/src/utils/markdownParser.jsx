import React from 'react';

// Parse inline bold **text** into React elements
export const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const clean = part.slice(2, -2);
      return <strong key={idx} className="md-strong">{clean}</strong>;
    }
    return part;
  });
};

// Convert Markdown blocks to React elements
export const renderMarkdown = (text) => {
  if (!text) return null;
  const blocks = text.split(/\n\n+/);

  return blocks.map((block, blockIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Headings ### ## #
    if (trimmed.startsWith('### ')) {
      const content = trimmed.replace(/^###\s+/, '');
      return <h5 key={blockIdx} className="md-h">{parseInlineMarkdown(content)}</h5>;
    }
    if (trimmed.startsWith('## ')) {
      const content = trimmed.replace(/^##\s+/, '');
      return <h4 key={blockIdx} className="md-h">{parseInlineMarkdown(content)}</h4>;
    }
    if (trimmed.startsWith('# ')) {
      const content = trimmed.replace(/^#\s+/, '');
      return <h3 key={blockIdx} className="md-h">{parseInlineMarkdown(content)}</h3>;
    }

    // Unordered lists (lines starting with - or *)
    const lines = trimmed.split('\n');
    const isList = lines.every(line => {
      const l = line.trim();
      return l.startsWith('- ') || l.startsWith('* ') || l === '';
    });
    
    if (isList && lines.some(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
      return (
        <ul key={blockIdx} className="md-ul">
          {lines
            .filter(line => line.trim() !== '')
            .map((line, lineIdx) => {
              const content = line.trim().replace(/^[-*]\s+/, '');
              return <li key={lineIdx} className="md-li">{parseInlineMarkdown(content)}</li>;
            })}
        </ul>
      );
    }

    // Normal paragraph
    const paragraphContent = lines.map((line, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {parseInlineMarkdown(line)}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    ));
    return <p key={blockIdx} className="md-p">{paragraphContent}</p>;
  });
};
