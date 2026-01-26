import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected, walletConnect } from 'wagmi/connectors'

// Pars Network chain definition
export const parsNetwork = defineChain({
  id: 494949,
  name: 'Pars Network',
  nativeCurrency: {
    decimals: 18,
    name: 'PARS',
    symbol: 'PARS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.pars.network'] },
  },
  blockExplorers: {
    default: { name: 'Pars Explorer', url: 'https://explore.pars.network' },
  },
})

export const config = createConfig({
  chains: [parsNetwork],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID || 'pars-id',
    }),
  ],
  transports: {
    [parsNetwork.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
