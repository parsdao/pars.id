import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { User, LogOut, Wallet } from 'lucide-react'

function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2">
          <User className="w-4 h-4 text-pars-gold" />
          <span className="text-sm font-medium">{shortenAddress(address)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pars-gold to-amber-500 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ))}
    </div>
  )
}
