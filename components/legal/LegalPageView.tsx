import type { LegalPage } from '@/lib/legal';

export default function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <article className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{page.title}</h1>
          <p className="text-sm text-gray-500 mb-10">{page.updated}</p>
          <p className="text-gray-300 leading-relaxed mb-10">{page.intro}</p>

          <div className="space-y-8">
            {page.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-lg font-bold text-white mb-2">{s.heading}</h2>
                {s.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-gray-400 leading-relaxed mb-2">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="space-y-2 mt-2">
                    {s.list.map((item, li) => (
                      <li key={li} className="flex items-start gap-2 text-gray-400 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-tovernet-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
