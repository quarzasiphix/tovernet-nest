import Image from 'next/image';
import { ArrowRight, ExternalLink, LayoutDashboard, Plus, Search } from 'lucide-react';

const CREAM = '#fbf7ef';
const BORDER = '#f0e6d2';
const NAVY = '#1b2740';
const MUTED = '#5b6b8c';
const TEAL = '#14ab9d';
const TEAL_SOFT = '#d5f5f0';
const PINK_SOFT = '#fce7f3';
const LAVENDER_SOFT = '#ece7ff';
const YELLOW_SOFT = '#fef3c7';

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border kennel-card-shadow bg-white" style={{ borderColor: BORDER }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: BORDER }}>
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <span className="ml-2 text-[11px] font-mono truncate" style={{ color: MUTED }}>{url}</span>
      </div>
      {children}
    </div>
  );
}

function PanelStatic() {
  return (
    <div style={{ background: CREAM }} className="p-4">
      <div className="rounded-xl bg-white p-3 mb-2" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: TEAL_SOFT }}>
            <LayoutDashboard className="h-3.5 w-3.5" style={{ color: TEAL }} />
          </div>
          <div className="flex-1 flex items-center gap-1 rounded-md px-2 h-6" style={{ background: CREAM }}>
            <Search className="h-3 w-3" style={{ color: MUTED }} />
            <span className="text-[10px]" style={{ color: MUTED }}>Szukaj psa...</span>
          </div>
          <div className="h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
            <Plus className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[TEAL_SOFT, PINK_SOFT, LAVENDER_SOFT].map((bg, i) => (
            <div key={i} className="h-10 rounded-lg" style={{ background: bg }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[YELLOW_SOFT, TEAL_SOFT].map((bg, i) => (
          <div key={i} className="rounded-xl p-2.5 bg-white" style={{ border: `1px solid ${BORDER}` }}>
            <div className="h-8 w-8 rounded-md mb-1.5" style={{ background: bg }} />
            <div className="h-2 rounded-full w-4/5" style={{ background: CREAM }} />
          </div>
        ))}
      </div>
    </div>
  );
}

type CaseStudyPreviewProps = {
  publicLabel: string;
  panelLabel: string;
  publicItems: string[];
  panelItems: string[];
  callout: string;
  ctaOpenLabel: string;
  ctaOpenHref: string;
  ctaPanelLabel: string;
  ctaPanelHref: string;
};

export default function CaseStudyPreview({
  publicLabel,
  panelLabel,
  publicItems,
  panelItems,
  callout,
  ctaOpenLabel,
  ctaOpenHref,
  ctaPanelLabel,
  ctaPanelHref,
}: CaseStudyPreviewProps) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <BrowserChrome url="hodowlagryfinyork.pl">
            <div className="relative w-full aspect-[1440/900]">
              <Image
                src="/screenshots/clients/gryfin-york.png"
                alt={publicLabel}
                fill
                className="object-cover object-top"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </BrowserChrome>
          <p className="mt-3 text-sm font-bold" style={{ color: NAVY }}>{publicLabel}</p>
          <ul className="mt-2 space-y-1.5 text-sm" style={{ color: MUTED }}>
            {publicItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <BrowserChrome url="panel.twojahodowla.pl">
            <PanelStatic />
          </BrowserChrome>
          <p className="mt-3 text-sm font-bold" style={{ color: NAVY }}>{panelLabel}</p>
          <ul className="mt-2 space-y-1.5 text-sm" style={{ color: MUTED }}>
            {panelItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl p-6 text-center mb-8" style={{ background: TEAL_SOFT }}>
        <p className="text-base sm:text-lg font-semibold" style={{ color: NAVY }}>{callout}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={ctaOpenHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-tovernet-gradient text-white px-6 py-3 rounded-xl font-semibold hover-lift transition-all"
        >
          {ctaOpenLabel}
          <ExternalLink className="h-4 w-4" />
        </a>
        <a
          href={ctaPanelHref}
          className="inline-flex items-center gap-2 bg-white border text-sm sm:text-base px-6 py-3 rounded-xl font-semibold transition-colors hover:bg-kennel-cream-200"
          style={{ borderColor: BORDER, color: NAVY }}
        >
          {ctaPanelLabel}
        </a>
      </div>
    </div>
  );
}
