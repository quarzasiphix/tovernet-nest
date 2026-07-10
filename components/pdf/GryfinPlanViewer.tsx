'use client';

import { useState, useRef, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

const PDF_META = {
  documentKey: 'gryfin_plan',
  documentTitle: 'Gryfin Plan',
  documentPath: '/pdf/gryfin',
  assetPath: '/pdf/gryfin-plan.pdf',
} as const;

export default function GryfinPlanViewer() {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posthog = usePostHog();

  const sessionStart = useRef(Date.now());
  const seenPages = useRef<Set<number>>(new Set());
  const pageEntryTime = useRef<Record<number, number>>({});
  const pageDwellMs = useRef<Record<number, number>>({});
  const numPagesRef = useRef(0);

  const capturePdfEvent = (event: string, properties: Record<string, unknown> = {}) => {
    posthog?.capture(event, {
      document_key: PDF_META.documentKey,
      document_title: PDF_META.documentTitle,
      document_path: PDF_META.documentPath,
      pdf_asset_path: PDF_META.assetPath,
      ...properties,
    });
  };

  useEffect(() => {
    if (!posthog) return;
    posthog.startSessionRecording(true);
    const heartbeat = setInterval(() => {
      capturePdfEvent('pdf_gryfin_reading_heartbeat', {
        current_page: currentPage,
        total_pages: numPagesRef.current,
      });
    }, 60_000);
    return () => clearInterval(heartbeat);
  }, [posthog, currentPage]);

  useEffect(() => {
    const entryRef = pageEntryTime;
    const dwellRef = pageDwellMs;
    const seenRef = seenPages;
    const startRef = sessionStart;
    const pagesRef = numPagesRef;

    capturePdfEvent('pdf_gryfin_opened');
    return () => {
      const entrySnapshot = { ...entryRef.current };
      const dwellSnapshot = { ...dwellRef.current };
      Object.entries(entrySnapshot).forEach(([page, t]) => {
        const p = Number(page);
        dwellSnapshot[p] = (dwellSnapshot[p] ?? 0) + (Date.now() - t);
      });
      const seen = Array.from(seenRef.current).sort((a, b) => a - b);
      const furthest = seen.length ? Math.max(...seen) : 0;
      const total = pagesRef.current;
      capturePdfEvent('pdf_gryfin_session_ended', {
        total_time_sec: Math.round((Date.now() - startRef.current) / 1000),
        pages_viewed: seen,
        pages_viewed_count: seen.length,
        furthest_page: furthest,
        total_pages: total,
        completion_pct: total > 0 ? Math.round((furthest / total) * 100) : 0,
        dwell_sec_per_page: Object.fromEntries(
          Object.entries(dwellSnapshot).map(([k, v]) => [k, Math.round(v / 1000)])
        ),
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(Math.min(containerRef.current.clientWidth - 32, 1200));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const pdfjs = await import('pdfjs-dist/build/pdf.js' as any);
      const lib = pdfjs.default ?? pdfjs;
      lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.js`;

      const pdf = await lib.getDocument(PDF_META.assetPath).promise;
      if (cancelled) return;

      numPagesRef.current = pdf.numPages;
      setNumPages(pdf.numPages);
      pageRefs.current = new Array(pdf.numPages).fill(null);
      capturePdfEvent('pdf_gryfin_loaded', { total_pages: pdf.numPages });

      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL('image/png');
        if (!cancelled) setPageImages((prev) => [...prev, dataUrl]);
      }

      if (!cancelled) setLoading(false);
    };

    render().catch((error) => {
      capturePdfEvent('pdf_gryfin_load_failed', {
        error_message: error instanceof Error ? error.message : 'Unknown PDF load error',
      });
      console.error(error);
    });
    return () => { cancelled = true; };
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
              capturePdfEvent('pdf_gryfin_page_viewed', {
                page: pageNum,
                total_pages: numPages,
              });
            }
          } else {
            const t = pageEntryTime.current[pageNum];
            if (t != null) {
              pageDwellMs.current[pageNum] = (pageDwellMs.current[pageNum] ?? 0) + (Date.now() - t);
              delete pageEntryTime.current[pageNum];
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    pageRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [numPages, posthog]);

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Gryfin Plan</span>
        {numPages > 0 && (
          <span className="text-slate-400 text-sm">Page {currentPage} / {numPages}</span>
        )}
      </div>

      <div ref={containerRef} className="flex flex-col items-center py-8 px-4 w-full">
        {loading && pageImages.length === 0 && (
          <div className="text-slate-400 py-20">Loading document…</div>
        )}

        {pageImages.map((src, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <div
              ref={(el) => { pageRefs.current[i] = el; }}
              data-page={i + 1}
              className="shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Page ${i + 1}`}
                draggable={false}
                style={{ display: 'block', width: '100%', maxWidth: 1000, height: 'auto', userSelect: 'none', touchAction: 'pan-x pan-y pinch-zoom' }}
              />
            </div>
            {i < numPages - 1 && (
              <div className="w-full h-8 bg-slate-950" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
