import { FileText, Landmark, Users, Sparkles, CheckCircle2 } from 'lucide-react';

// Static mockup — colors from the ksiegai brand group already used site-wide
// (tailwind.config.ts), tabs/features grounded in the real modules in
// ksef-ai/src/modules (invoices, ksef, banking, customers) and the real
// MCP AI-agent integration in ksiegai-mcp. No fabricated stats.
const PURPLE = '#7c3aed';
const PURPLE_SOFT = '#ede9fe';
const INK = '#1e1b2e';
const MUTED = '#6b6478';
const BORDER = '#e9e4f5';
const CARD = '#ffffff';
const BG = '#faf9fc';
const GREEN = '#059669';
const GREEN_SOFT = '#d1fae5';

const TABS = ['Faktury', 'KSeF', 'Wydatki', 'Bank', 'Kontrahenci'];

export default function KsiegaiShowcase() {
  return (
    <div className="rounded-2xl overflow-hidden border kennel-card-shadow" style={{ borderColor: BORDER }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b" style={{ borderColor: BORDER }}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 text-xs font-mono" style={{ color: MUTED }}>app.ksiegai.pl</span>
      </div>

      <div className="p-5 sm:p-6" style={{ background: BG }}>
        {/* tab bar */}
        <div className="flex gap-1 mb-5 overflow-x-auto">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={i === 0 ? { background: PURPLE, color: 'white' } : { background: 'white', color: MUTED, border: `1px solid ${BORDER}` }}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* invoice + KSeF status */}
          <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: PURPLE_SOFT }}>
                <FileText className="h-4 w-4" style={{ color: PURPLE }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: INK }}>Faktura FV/08/2026/112</p>
                <p className="text-xs" style={{ color: MUTED }}>3 240,00 zł</p>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: GREEN_SOFT, color: GREEN }}
            >
              <CheckCircle2 className="h-3 w-3" />
              Wysłano do KSeF
            </span>
          </div>

          {/* bank sync */}
          <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: PURPLE_SOFT }}>
                <Landmark className="h-4 w-4" style={{ color: PURPLE }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: INK }}>Przelew przychodzący</p>
                <p className="text-xs" style={{ color: MUTED }}>+3 240,00 zł</p>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: GREEN_SOFT, color: GREEN }}
            >
              <CheckCircle2 className="h-3 w-3" />
              Dopasowano automatycznie
            </span>
          </div>

          {/* customer */}
          <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: PURPLE_SOFT }}>
                <Users className="h-4 w-4" style={{ color: PURPLE }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: INK }}>Kontrahenci</p>
                <p className="text-xs" style={{ color: MUTED }}>Historia i dane firmy w jednym miejscu</p>
              </div>
            </div>
          </div>

          {/* AI / MCP callout */}
          <div className="rounded-xl p-4" style={{ background: PURPLE, color: 'white' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-bold">Dostęp dla asystentów AI</p>
            </div>
            <p className="text-xs opacity-90">Połącz Claude lub inny asystent AI z KsięgaI przez MCP.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
