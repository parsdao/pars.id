import { useState, useEffect } from 'react'
import { User, LogOut } from 'lucide-react'

const IAM_URL = 'https://iam.hanzo.ai'
const APP_NAME = 'pars-id'

interface UserInfo {
  id: string
  name: string
  displayName: string
  avatar: string
}

export function WalletConnect() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session or OAuth callback
  useEffect(() => {
    const checkAuth = async () => {
      // Check for OAuth callback code
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')

      if (code && state === 'pars') {
        // Exchange code for token
        try {
          const res = await fetch(`${IAM_URL}/api/login/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: APP_NAME,
              code,
              redirect_uri: window.location.origin,
            }),
          })

          if (res.ok) {
            const data = await res.json()
            localStorage.setItem('access_token', data.access_token)
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname)
          }
        } catch (e) {
          console.error('Token exchange failed:', e)
        }
      }

      // Check for existing token
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const res = await fetch(`${IAM_URL}/api/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const userInfo = await res.json()
            setUser(userInfo)
          } else {
            localStorage.removeItem('access_token')
          }
        } catch (e) {
          console.error('Failed to get user info:', e)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin)
    window.location.href = `${IAM_URL}/login/oauth/authorize?client_id=${APP_NAME}&response_type=code&redirect_uri=${redirectUri}&scope=openid%20profile&state=pars`
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-2 bg-neutral-800 rounded-lg">
        <span className="text-sm text-neutral-400">...</span>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />
          ) : (
            <User className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-sm font-medium">
            {user.displayName || user.name || user.id?.slice(0, 8)}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
    >
      Sign In
    </button>
  )
}
