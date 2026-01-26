import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ParsIdentityMint } from './components/ParsIdentityMint'
import { Shield, Globe, Zap, Fingerprint } from 'lucide-react'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-black">
          <Header />

          <main className="flex-1 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
              {/* Hero */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                  <Fingerprint size={16} />
                  <span>did:pars</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
                  Coercion-Resistant <span className="text-amber-400">Identity</span>
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                  Anonymous, secure identity for the Persian diaspora.
                  No KYC. No surveillance. No compromise.
                </p>
              </div>

              {/* Main Mint Component */}
              <div className="mb-16">
                <ParsIdentityMint />
              </div>

              {/* Features */}
              <section className="mb-16">
                <h2 className="text-2xl font-medium text-center mb-8">Why pars.id?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center">
                    <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Coercion Resistant</h3>
                    <p className="text-sm text-neutral-500">
                      Duress codes, dead man switches, and plausible deniability
                      for high-threat environments.
                    </p>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center">
                    <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Cross-Chain</h3>
                    <p className="text-sm text-neutral-500">
                      Resolve your DID across all MIGA ecosystem networks.
                      One identity, everywhere.
                    </p>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center">
                    <Zap className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Privacy First</h3>
                    <p className="text-sm text-neutral-500">
                      Post-quantum encryption. Zero-knowledge proofs.
                      Your data stays yours.
                    </p>
                  </div>
                </div>
              </section>

              {/* Network Info */}
              <section className="text-center">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-xl font-medium mb-4">Pars Network</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-400 text-xs mb-1">Chain ID</div>
                      <div className="font-mono font-bold text-amber-400">494949</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-400 text-xs mb-1">DID Method</div>
                      <div className="font-mono font-bold">did:pars</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-400 text-xs mb-1">RPC</div>
                      <div className="font-mono text-xs">rpc.pars.network</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-400 text-xs mb-1">Explorer</div>
                      <div className="font-mono text-xs">explore.pars.network</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <Footer />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
