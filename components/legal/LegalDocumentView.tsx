import { Download } from 'lucide-react';
import { inline, type LegalBlock } from '@/lib/legal/markdown.mjs';
import type { RegistryEntry } from '@/lib/legal/documents';

const Text = ({ text }: { text: string }) => (
  <>{inline(text).map((r, i) => (r.bold ? <strong key={i} className="text-white">{r.text}</strong> : <span key={i}>{r.text}</span>))}</>
);

function Block({ b }: { b: LegalBlock }) {
  switch (b.type) {
    case 'h1': return null; // rendered as the page title
    case 'h2': return <h2 className="text-lg font-bold text-white mt-10 mb-3 scroll-mt-24">{b.text}</h2>;
    case 'h3': return <h3 className="font-semibold text-white mt-6 mb-2">{b.text}</h3>;
    case 'p': return <p className="text-gray-300 leading-relaxed mb-3"><Text text={b.text} /></p>;
    case 'ul': return <ul className="list-disc pl-6 space-y-1.5 mb-3 text-gray-300">{b.items.map((x, i) => <li key={i}><Text text={x} /></li>)}</ul>;
    case 'ol': return <ol start={b.start} className="list-decimal pl-6 space-y-1.5 mb-3 text-gray-300 marker:text-gray-500">{b.items.map((x, i) => <li key={i} className="pl-1"><Text text={x} /></li>)}</ol>;
    case 'table':
      return (
        <div className="overflow-x-auto mb-4 -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead><tr>{b.head.map((c, i) => <th key={i} className="text-left font-semibold text-white bg-white/5 border border-white/10 px-3 py-2 align-top"><Text text={c} /></th>)}</tr></thead>
            <tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} className="text-gray-300 border border-white/10 px-3 py-2 align-top"><Text text={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
  }
}

export default function LegalDocumentView({ title, blocks, entry }: { title: string; blocks: LegalBlock[]; entry: RegistryEntry }) {
  return (
    <article className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-10">
            <span>Wersja {entry.version} z dnia {entry.effective}</span>
            {entry.pdf && (
              <a href={entry.pdf} download className="inline-flex items-center gap-1.5 text-tovernet-300 hover:text-white">
                <Download className="h-4 w-4" aria-hidden="true" />Pobierz PDF
              </a>
            )}
            <span className="font-mono text-xs break-all" title="Suma kontrolna SHA-256 tej wersji">SHA-256 {entry.sha256.slice(0, 16)}…</span>
          </div>
          {blocks.map((b, i) => <Block key={i} b={b} />)}
        </div>
      </div>
    </article>
  );
}
