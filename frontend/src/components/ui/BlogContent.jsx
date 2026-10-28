// Renders plain-text post content: blank lines separate paragraphs,
// lines starting with "## " / "### " become headings, "- " lines become lists.
// Links: [text](https://example.com), or a bare https:// URL.
// Rendered as React elements (no innerHTML), so admin input can't inject markup.
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

// Only allow web, mail, phone and same-site links (blocks javascript: etc.)
const safeHref = (url) => {
  if (/^(https?:|mailto:|tel:)/i.test(url) || url.startsWith('/') || url.startsWith('#')) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  return null;
};

function Inline({ text }) {
  const parts = [];
  let last = 0;
  let match;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const label = match[1] || match[3];
    const href = safeHref(match[2] || match[3]);
    if (href) {
      const external = /^https?:/i.test(href);
      parts.push(
        <a key={match.index} href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
          {label}
        </a>
      );
    } else {
      parts.push(match[0]);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function BlogContent({ content = '' }) {
  const blocks = content.replace(/\r\n/g, '\n').split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="blog-content">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) return <h3 key={i}><Inline text={block.slice(4)} /></h3>;
        if (block.startsWith('## ')) return <h2 key={i}><Inline text={block.slice(3)} /></h2>;
        const lines = block.split('\n');
        if (lines.every(l => l.trim().startsWith('- '))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}><Inline text={l.trim().slice(2)} /></li>)}</ul>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => <span key={j}><Inline text={l} />{j < lines.length - 1 && <br />}</span>)}
          </p>
        );
      })}
    </div>
  );
}
