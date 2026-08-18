import { ArrowRight, PawPrint, LayoutDashboard } from 'lucide-react';
import PuppyAvatar from './PuppyAvatar';

type BreederHomeCardProps = {
  href: string;
  title: string;
  description: string;
  cta: string;
};

export default function BreederHomeCard({ href, title, description, cta }: BreederHomeCardProps) {
  return (
    <a
      href={href}
      className="group relative bg-kennel-cream-100 border border-kennel-pink-200 rounded-2xl p-8 hover-lift overflow-hidden block"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-kennel-pink-100 flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-kennel-pink-600" />
          </div>
          <h3 className="text-2xl font-bold text-kennel-navy-900">{title}</h3>
        </div>
      </div>

      {/* mini visual: dashboard chip + puppy chip + status badge */}
      <div className="relative h-20 mb-5">
        <div className="absolute left-0 top-0 w-[58%] h-14 rounded-xl bg-white border border-kennel-navy-400/10 shadow-sm p-2 flex items-center gap-1.5">
          <LayoutDashboard className="h-3.5 w-3.5 text-kennel-teal-600 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-1.5 rounded-full bg-kennel-teal-300 w-full" />
            <div className="h-1.5 rounded-full bg-kennel-navy-400/25 w-2/3" />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-[52%] h-14 rounded-xl bg-white border border-kennel-navy-400/10 shadow-sm p-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-kennel-pink-100 flex items-center justify-center flex-shrink-0">
            <PuppyAvatar className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-kennel-yellow-100 text-amber-700">Dostępny</span>
        </div>
      </div>

      <p className="text-kennel-navy-700 font-medium mb-6 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-2 text-kennel-pink-600 font-semibold group-hover:gap-3 transition-all">
        {cta}
        <ArrowRight className="h-5 w-5" />
      </span>
    </a>
  );
}
