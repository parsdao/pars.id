import { Fingerprint, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-bold">pars.id</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-md">
              Coercion-resistant decentralized identity for the global Parsi community.
              Anonymous, secure, unstoppable.
            </p>
            <p className="text-xs text-neutral-500 mt-4">
              Chain ID: 494949 | did:pars
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="https://docs.pars.network" className="hover:text-white transition-colors flex items-center gap-1">
                  Documentation <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://github.com/parsdao/pips" className="hover:text-white transition-colors flex items-center gap-1">
                  PIPs <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://explore.pars.network" className="hover:text-white transition-colors flex items-center gap-1">
                  Explorer <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ecosystem</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="https://pars.network" className="hover:text-white transition-colors flex items-center gap-1">
                  Pars Network <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://migaprotocol.xyz" className="hover:text-white transition-colors flex items-center gap-1">
                  MIGA Protocol <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://hanzo.id" className="hover:text-white transition-colors flex items-center gap-1">
                  Hanzo ID <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-xs text-neutral-500">
          <p>Built on Hanzo IAM. Powered by Pars Network.</p>
        </div>
      </div>
    </footer>
  );
}
