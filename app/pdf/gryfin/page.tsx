import dynamic from 'next/dynamic';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const GryfinPlanViewer = dynamic(() => import('@/components/pdf/GryfinPlanViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading document…</p>
    </div>
  ),
});

export default function GryfinPlanPage() {
  return <GryfinPlanViewer />;
}
