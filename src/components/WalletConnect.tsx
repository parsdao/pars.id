import { useState, useRef, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { User, LogOut, Wallet, ChevronDown } from 'lucide-react'

const HANZO_IAM_URL = 'https://iam.hanzo.ai'
const PARS_APP_NAME = 'pars-id'

function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle wallet connection
  const handleConnect = async (connector: (typeof connectors)[number]) => {
    setShowDropdown(false)
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2">
          <User className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium">{shortenAddress(address)}</span>
        </div>
        <button
          onClick={() => {
            disconnect()
            localStorage.removeItem('hanzo_token')
          }}
          className="p-2 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Filter to unique connectors by name
  const uniqueConnectors = [...connectors].reduce((acc, connector) => {
    const existing = acc.find(c => c.name === connector.name)
    if (!existing) acc.push(connector)
    return acc
  }, [] as (typeof connectors)[number][])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-neutral-500 uppercase tracking-wider">
              Select Wallet
            </div>
            {uniqueConnectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-800 rounded-md transition-colors"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                {connector.name}
              </button>
            ))}
            <div className="border-t border-neutral-700 mt-2 pt-2">
              <a
                href={`${HANZO_IAM_URL}/login/oauth/authorize?client_id=${PARS_APP_NAME}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=openid%20profile&state=pars`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-800 rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-blue-400" />
                Sign in with Hanzo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
