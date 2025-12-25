import Link from "next/link";
import { ArrowRight, Sparkles, Network, Shield, Zap, Building2, FileText, Users, TrendingUp, PawPrint, Plane, Heart, Calculator, Receipt, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-tovernet-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent">
                TOVERNET
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#what-we-build" className="text-gray-300 hover:text-white transition-colors">What We Build</a>
              <a href="#verticals" className="text-gray-300 hover:text-white transition-colors">Operating Verticals</a>
              <a href="#engagement" className="text-gray-300 hover:text-white transition-colors">Engagement</a>
              <a href="#contact" className="px-6 py-2 bg-tovernet-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                Discuss Your System
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tovernet-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tovernet-500/10 border border-tovernet-500/30 mb-8 magical-glow">
              <Sparkles className="h-4 w-4 text-tovernet-400" />
              <span className="text-tovernet-300 text-sm font-semibold">The Digital Operating Layer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Digital Infrastructure for Businesses That{" "}
              <span className="bg-gradient-to-r from-tovernet-400 via-ksiegai-400 to-tovernet-500 bg-clip-text text-transparent">
                Cannot Afford Chaos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We design, deploy, and govern business infrastructure for ventures that must scale, comply, and coordinate across systems, people, and jurisdictions.
            </p>
            
            <p className="text-lg text-tovernet-300 mb-12 font-medium">
              Custom digital systems for businesses that want structure, not tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
              >
                Request Infrastructure Review
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#verticals"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                See What We Operate
              </a>
            </div>

            {/* Key Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Shield className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Operational Clarity</h3>
                <p className="text-gray-400 text-sm">Systems that respect law, scale, and money</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Network className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Systemized Decision-Making</h3>
                <p className="text-gray-400 text-sm">Automation that coordinates people and data</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Zap className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Traceability</h3>
                <p className="text-gray-400 text-sm">Full audit trails and governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section id="what-we-build" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What We Architect
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything is built specifically for your business logic. No generic tools. No forced workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Building2 className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Internal Systems</h3>
                <p className="text-gray-300 mb-4">
                  Finance, documents, workflows — structured around how your business actually operates.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Compliance-critical systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Automated decision workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Document & data governance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Globe className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">External Systems</h3>
                <p className="text-gray-300 mb-4">
                  Web platforms, client portals, and customer-facing interfaces that scale.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Custom business websites as systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Client & admin portals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Integration layers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Zap className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Automation & Orchestration</h3>
                <p className="text-gray-300 mb-4">
                  AI-assisted operations and workflow automation that coordinates people, data, and decisions.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Internal automation workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>AI-assisted decision support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Cross-system orchestration</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Shield className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Governance & Auditability</h3>
                <p className="text-gray-300 mb-4">
                  Data structure, visibility, and full audit trails for regulated environments.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Compliance tracking & reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Full operational history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                    <span>Data structure & visibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Verticals Section */}
      <section id="verticals" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Live Operating Verticals
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We don't theorize. We operate. These are systems we run ourselves under real legal and operational pressure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* KsięgaI Vertical */}
              <div className="group relative bg-gradient-to-br from-ksiegai-900/40 to-purple-900/40 border border-ksiegai-500/30 rounded-3xl p-10 hover-lift magical-glow overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ksiegai-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="h-10 w-10 text-ksiegai-400" />
                    <Receipt className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Financial Infrastructure
                  </h3>
                  <div className="inline-block px-3 py-1 bg-ksiegai-500/20 border border-ksiegai-400/30 rounded-full mb-6">
                    <span className="text-ksiegai-300 text-sm font-semibold">KSeF-Ready Systems</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Example of infrastructure under regulatory pressure. Central business registry: documents, decisions, roles, and finances in one auditable structure.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                      <span>Document reconciliation layer before KSeF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                      <span>Verified business network</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                      <span>Full audit trail & compliance</span>
                    </li>
                  </ul>
                  <a
                    href="https://ksiegai.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Visit KsięgaI
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Global Pet Vertical */}
              <div className="group relative bg-gradient-to-br from-globalpet-900/40 to-green-900/40 border border-globalpet-500/30 rounded-3xl p-10 hover-lift magical-glow-green overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-globalpet-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <PawPrint className="h-10 w-10 text-globalpet-400" />
                    <Plane className="h-10 w-10 text-green-400" />
                    <Heart className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Licensed Logistics Operations
                  </h3>
                  <div className="inline-block px-3 py-1 bg-globalpet-500/20 border border-globalpet-400/30 rounded-full mb-6">
                    <span className="text-globalpet-300 text-sm font-semibold">EU Pet Transport</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    Example of infrastructure under physical and legal constraints. Licensed animal transportation across EU jurisdictions.
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-globalpet-400 flex-shrink-0 mt-0.5" />
                      <span>Multi-jurisdiction compliance tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-globalpet-400 flex-shrink-0 mt-0.5" />
                      <span>Real-time coordination systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-globalpet-400 flex-shrink-0 mt-0.5" />
                      <span>Licensed operational infrastructure</span>
                    </li>
                  </ul>
                  <div className="inline-flex items-center gap-2 bg-globalpet-gradient text-white px-6 py-3 rounded-lg font-semibold opacity-75">
                    <span>Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Custom Infrastructure?
            </h2>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Most software forces companies to adapt to tools.
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent mb-12">
              We build tools around companies.
            </p>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <p className="text-xl text-gray-300 leading-relaxed">
                Built systems scale. Tools don't. When you need structure that respects your business logic, 
                regulatory requirements, and growth trajectory — generic SaaS won't cut it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Model Section */}
      <section id="engagement" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How Engagement Works
              </h2>
              <p className="text-xl text-gray-300">
                This is not one-off web dev. This is infrastructure partnership.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-tovernet-400">1</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Map</h3>
                <p className="text-gray-400 text-sm">We map your business logic and requirements</p>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-tovernet-400">2</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Design</h3>
                <p className="text-gray-400 text-sm">We design the system architecture</p>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-tovernet-400">3</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Build</h3>
                <p className="text-gray-400 text-sm">We build and integrate the infrastructure</p>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-tovernet-400">4</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Evolve</h3>
                <p className="text-gray-400 text-sm">We maintain and evolve it with you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Structure?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Custom digital infrastructure for businesses that outgrew templates.
            </p>
            <a
              href="mailto:contact@tovernet.online"
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
            >
              Request Infrastructure Review
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-tovernet-400" />
                  <span className="text-xl font-bold text-white">TOVERNET</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Digital infrastructure for businesses that cannot afford chaos.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Operating Verticals</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="https://ksiegai.pl" target="_blank" rel="noopener noreferrer" className="hover:text-ksiegai-400 transition-colors">
                      KsięgaI - Financial Infrastructure
                    </a>
                  </li>
                  <li className="text-gray-500">Global Pet - Licensed Logistics (Coming Soon)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="mailto:contact@tovernet.online" className="hover:text-tovernet-400 transition-colors">
                      contact@tovernet.online
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} TOVERNET. Built systems scale. Tools don't.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
