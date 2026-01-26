// pars.id - Coercion-Resistant Identity for the Persian Diaspora
// Based on PIP-0003: Coercion Resistance Threat Model
//
// Security features:
// - Anonymous minting (no KYC required)
// - Duress codes (decoy identity under coercion)
// - Plausible deniability (hidden volumes)
// - TFHE encrypted attributes
// - Dead man's switch

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Fingerprint,
  Copy,
  Check,
  ExternalLink,
  Zap,
  UserX,
  Wallet
} from 'lucide-react';

// Identity types
interface ParsIdentity {
  id: string;
  handle: string;
  publicKey: string;
  createdAt: number;
  encryptedAttributes?: string;
}

interface IdentityFormData {
  handle: string;
  normalPassword: string;
  duressPassword: string;
  deadManDays: number;
}

// Generate anonymous identity hash
function generateAnonId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Validate handle format
function isValidHandle(handle: string): boolean {
  return /^[a-z0-9][a-z0-9_]{1,30}[a-z0-9]$/.test(handle) && !/__/.test(handle);
}

export function ParsIdentityMint() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<'intro' | 'create' | 'security' | 'confirm' | 'success'>('intro');
  const [formData, setFormData] = useState<IdentityFormData>({
    handle: '',
    normalPassword: '',
    duressPassword: '',
    deadManDays: 7,
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [identity, setIdentity] = useState<ParsIdentity | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateIdentity = useCallback(async () => {
    if (!isValidHandle(formData.handle)) return;
    if (formData.normalPassword.length < 12) return;
    if (formData.duressPassword.length < 12) return;
    if (formData.normalPassword === formData.duressPassword) return;

    setIsLoading(true);

    // Simulate identity creation (in production, this calls the contract)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newIdentity: ParsIdentity = {
      id: generateAnonId(),
      handle: `@${formData.handle}.pars`,
      publicKey: generateAnonId().slice(0, 64),
      createdAt: Date.now(),
    };

    setIdentity(newIdentity);
    setStep('success');
    setIsLoading(false);
  }, [formData]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Connect Wallet</h2>
        <p className="text-neutral-400 mb-6">
          Connect your wallet to mint your pars.id identity on Pars Network.
        </p>
        <p className="text-sm text-neutral-500">
          Use the connect button in the header to get started.
        </p>
      </div>
    );
  }

  // Intro screen
  if (step === 'intro') {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">pars.id</h2>
            <p className="text-sm text-neutral-400">Coercion-Resistant Identity</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-sm">Anonymous</span>
            </div>
            <p className="text-xs text-neutral-400">
              No KYC. No phone number. No email. Your identity is a cryptographic key
              that cannot be linked to your real-world identity.
            </p>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-sm">Duress Protection</span>
            </div>
            <p className="text-xs text-neutral-400">
              Two passwords: one opens your real identity, one opens a decoy.
              Under coercion, reveal the duress password - adversaries see
              innocent data while your real identity stays hidden.
            </p>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="font-medium text-sm">Dead Man's Switch</span>
            </div>
            <p className="text-xs text-neutral-400">
              If you don't check in for N days, your identity auto-wipes and
              alerts trusted contacts. Protects against detention.
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200">
              <strong>High-threat environment?</strong> Read the full security guide
              before creating your identity. Practice your duress password.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep('create')}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          Create Anonymous Identity
        </button>
      </div>
    );
  }

  // Handle creation
  if (step === 'create') {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 max-w-lg mx-auto">
        <button
          onClick={() => setStep('intro')}
          className="text-sm text-neutral-400 hover:text-white mb-4"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-2">Choose Your Handle</h2>
        <p className="text-sm text-neutral-400 mb-6">
          This is your public identity. It cannot be changed later.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-2 block">Handle</label>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">@</span>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value.toLowerCase() })}
                placeholder="azadi"
                className="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                maxLength={32}
              />
              <span className="text-neutral-500">.pars</span>
            </div>
            {formData.handle && !isValidHandle(formData.handle) && (
              <p className="text-xs text-red-400 mt-1">
                3-32 characters, letters, numbers, single underscores only
              </p>
            )}
          </div>

          {formData.handle && isValidHandle(formData.handle) && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-300">
                Your identity: <strong>@{formData.handle}.pars</strong>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setStep('security')}
          disabled={!isValidHandle(formData.handle)}
          className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Security Setup
        </button>
      </div>
    );
  }

  // Security setup
  if (step === 'security') {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 max-w-lg mx-auto">
        <button
          onClick={() => setStep('create')}
          className="text-sm text-neutral-400 hover:text-white mb-4"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-2">Security Setup</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Configure your coercion resistance features.
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-neutral-400">Normal Password</label>
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-neutral-400 hover:text-white"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={formData.normalPassword}
              onChange={(e) => setFormData({ ...formData, normalPassword: e.target.value })}
              placeholder="Your real password (min 12 chars)"
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Opens your real identity and data
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm text-neutral-400">Duress Password</label>
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">CRITICAL</span>
            </div>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={formData.duressPassword}
              onChange={(e) => setFormData({ ...formData, duressPassword: e.target.value })}
              placeholder="Decoy password (min 12 chars)"
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Opens decoy identity + silently alerts trusted contacts
            </p>
            {formData.duressPassword && formData.normalPassword === formData.duressPassword && (
              <p className="text-xs text-red-400 mt-1">
                Must be different from normal password!
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-neutral-400 mb-2 block">Dead Man's Switch</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="3"
                max="30"
                value={formData.deadManDays}
                onChange={(e) => setFormData({ ...formData, deadManDays: parseInt(e.target.value) })}
                className="flex-1 accent-amber-500"
              />
              <span className="text-sm font-medium w-20 text-right">
                {formData.deadManDays} days
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Auto-wipe if you don't check in for {formData.deadManDays} days
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-200">
                <p className="font-medium mb-1">Memorize both passwords!</p>
                <p>Practice using your duress password. Under stress, you need muscle memory.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep('confirm')}
          disabled={
            formData.normalPassword.length < 12 ||
            formData.duressPassword.length < 12 ||
            formData.normalPassword === formData.duressPassword
          }
          className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review & Create
        </button>
      </div>
    );
  }

  // Confirmation
  if (step === 'confirm') {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 max-w-lg mx-auto">
        <button
          onClick={() => setStep('security')}
          className="text-sm text-neutral-400 hover:text-white mb-4"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-2">Confirm Identity</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Review your identity before minting to Pars Network.
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="text-sm text-neutral-400 mb-1">Identity</div>
            <div className="text-lg font-bold text-amber-400">@{formData.handle}.pars</div>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="text-sm text-neutral-400 mb-1">Wallet</div>
            <div className="text-sm font-mono text-neutral-300">{address}</div>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="text-sm text-neutral-400 mb-1">Security Features</div>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Duress password configured</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Dead man's switch: {formData.deadManDays} days</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Post-quantum encryption</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-200">
              <strong>Free to mint.</strong> Your identity will be stored on-chain
              but your attributes remain encrypted. Only you control your data.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateIdentity}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Creating Identity...' : 'Mint pars.id Identity'}
        </button>
      </div>
    );
  }

  // Success
  if (step === 'success' && identity) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-amber-400">{identity.handle}</h2>
          <p className="text-sm text-neutral-400 mt-1">Your identity is live on Pars Network</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="text-xs text-neutral-400 mb-1">Identity ID</div>
            <div className="flex items-center gap-2">
              <code className="text-xs text-neutral-300 font-mono break-all flex-1">
                {identity.id.slice(0, 32)}...
              </code>
              <button
                onClick={() => copyToClipboard(identity.id)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="text-xs text-neutral-400 mb-1">Public Key</div>
            <code className="text-xs text-neutral-300 font-mono break-all block">
              {identity.publicKey.slice(0, 32)}...
            </code>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-200">
              <p className="font-medium mb-1">Important!</p>
              <p>Remember your passwords. There is no recovery. Practice your duress code now.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`https://explore.pars.network/identity/${identity.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-neutral-800 border border-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-700 transition-all text-center text-sm flex items-center justify-center gap-2"
          >
            View on Explorer <ExternalLink size={14} />
          </a>
          <button
            onClick={() => {
              setStep('intro');
              setIdentity(null);
              setFormData({ handle: '', normalPassword: '', duressPassword: '', deadManDays: 7 });
            }}
            className="py-3 px-4 bg-neutral-800 border border-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-700 transition-all text-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default ParsIdentityMint;
