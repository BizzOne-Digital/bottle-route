// Renders plain-text post content: blank lines separate paragraphs,
// lines starting with "## " / "### " become headings, "- " lines become lists.
// Rendered as React elements (no innerHTML), so admin input can't inject markup.
export default function BlogContent({ content = '' }) {
  const blocks = content.replace(/\r\n/g, '\n').split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="blog-content">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) return <h3 key={i}>{block.slice(4)}</h3>;
        if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>;
        const lines = block.split('\n');
        if (lines.every(l => l.trim().startsWith('- '))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}</ul>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => <span key={j}>{l}{j < lines.length - 1 && <br />}</span>)}
          </p>
        );
      })}
    </div>
  );
}
