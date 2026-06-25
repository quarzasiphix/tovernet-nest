'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePostHog } from 'posthog-js/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PokPlanViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posthog = usePostHog();

  // tracking state
  const sessionStart = useRef(Date.now());
  const seenPages = useRef<Set<number>>(new Set());
  const pageEntryTime = useRef<Record<number, number>>({});
  const pageDwellMs = useRef<Record<number, number>>({});
  const numPagesRef = useRef(0);

  useEffect(() => {
    posthog?.capture('pdf_opened', { document: 'pok_plan' });

    return () => {
      // flush any open page dwell
      Object.entries(pageEntryTime.current).forEach(([page, entryMs]) => {
        const p = Number(page);
        pageDwellMs.current[p] = (pageDwellMs.current[p] ?? 0) + (Date.now() - entryMs);
      });

      const seen = Array.from(seenPages.current).sort((a, b) => a - b);
      const furthest = seen.length ? Math.max(...seen) : 0;
      const total = numPagesRef.current;

      posthog?.capture('pdf_session_end', {
        document: 'pok_plan',
        total_time_sec: Math.round((Date.now() - sessionStart.current) / 1000),
        pages_viewed: seen,
        pages_viewed_count: seen.length,
        furthest_page: furthest,
        total_pages: total,
        completion_pct: total > 0 ? Math.round((furthest / total) * 100) : 0,
        dwell_sec_per_page: Object.fromEntries(
          Object.entries(pageDwellMs.current).map(([k, v]) => [k, Math.round(v / 1000)])
        ),
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(Math.min(containerRef.current.clientWidth - 32, 1000));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const pageNum = Number(entry.target.getAttribute('data-page'));

          if (entry.isIntersecting) {
            setCurrentPage(pageNum);
            pageEntryTime.current[pageNum] = Date.now();

            if (!seenPages.current.has(pageNum)) {
              seenPages.current.add(pageNum);
              posthog?.capture('pdf_page_viewed', {
                document: 'pok_plan',
                page: pageNum,
                total_pages: numPages,
              });
            }
          } else {
            const entry_ms = pageEntryTime.current[pageNum];
            if (entry_ms != null) {
              pageDwellMs.current[pageNum] =
                (pageDwellMs.current[pageNum] ?? 0) + (Date.now() - entry_ms);
              delete pageEntryTime.current[pageNum];
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [numPages, posthog]);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    numPagesRef.current = numPages;
    pageRefs.current = new Array(numPages).fill(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">POK Plan</span>
        {numPages > 0 && (
          <span className="text-slate-400 text-sm">
            Page {currentPage} / {numPages}
          </span>
        )}
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-4 px-4">
        <Document
          file="/pdf/pok_plan.pdf"
          onLoadSuccess={onLoadSuccess}
          loading={<div className="text-slate-400 py-20">Loading document…</div>}
          error={<div className="text-red-400 py-20">Failed to load PDF.</div>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => { pageRefs.current[i] = el; }}
              data-page={i + 1}
              className="shadow-2xl"
            >
              <Page
                pageNumber={i + 1}
                width={width}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
