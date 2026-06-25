import dynamic from 'next/dynamic';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // no maximumScale/userScalable — allows native pinch-to-zoom
};

const PokPlanViewer = dynamic(() => import('@/components/pdf/PokPlanViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading document…</p>
    </div>
  ),
});

export default function PokPlanPage() {
  return <PokPlanViewer />;
}
