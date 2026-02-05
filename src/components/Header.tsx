import { WalletConnect } from './WalletConnect';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-neutral-800">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Pars Network"
              className="w-10 h-10"
            />
            <div>
              <span className="text-xl font-bold text-white">pars.id</span>
              <span className="text-xs text-neutral-500 block">did:pars</span>
            </div>
          </a>

          <div className="flex items-center gap-4">
            <a
              href="https://pars.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
            >
              Pars Network
            </a>
            <a
              href="https://github.com/parsdao"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
            >
              GitHub
            </a>
            <WalletConnect />
          </div>
        </div>
      </nav>
    </header>
  );
}
