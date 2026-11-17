import { Fragment, type CSSProperties, type ElementType } from 'react';
import type { Line } from '@/lib/site/copy';
import s from './site.module.css';

/** Renders headline lines; `{ em }` segments in the serif italic. `split`: one masked reveal per line. */
export function Lines({ lines, as: Tag = 'h2', className, split = false, start = 0 }: {
  lines: Line[]; as?: ElementType; className?: string; split?: boolean; start?: number;
}) {
  const seg = (line: Line) => line.map((part, j) => (typeof part === 'string' ? <Fragment key={j}>{part}</Fragment> : <span key={j} className={s.em}>{part.em}</span>));
  return (
    <Tag className={className}>
      {lines.map((line, i) => split
        ? <span key={i} className={s.line} style={{ '--d': `${start + i * 90}ms` } as CSSProperties} data-reveal="mask"><span>{seg(line)}</span></span>
        : <Fragment key={i}>{seg(line)}{i < lines.length - 1 ? ' ' : null}</Fragment>)}
    </Tag>
  );
}

/** Plain text of lines, for aria labels and metadata. */
export const plain = (lines: Line[]) => lines.map((l) => l.map((p) => (typeof p === 'string' ? p : p.em)).join('')).join(' ');

/** "(02) Realizacje ———— 6 projektów" */
export function SectionHead({ num, label, aside }: { num: string; label: string; aside?: string }) {
  return (
    <div className={s.secHead}>
      <p className={s.label}><b>({num})</b> {label}</p>
      <i aria-hidden="true" />
      {aside ? <p className={s.label}>{aside}</p> : <span />}
    </div>
  );
}
