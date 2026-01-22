'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/launch');
    }
  }, [ready, authenticated, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            SafeLaunch
          </h1>
          <p className="text-2xl text-purple-200">
            Reputation-Gated Launches
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6 border border-white/20">
          <p className="text-lg text-gray-200">
            Launch access determined by your Ethos credibility score.
            <br />
            No wallet switching. No email. Just reputation.
          </p>

          <button
            onClick={login}
            disabled={!ready}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
          >
            Sign in with Ethos
          </button>

          <div className="text-sm text-gray-400 space-y-2">
            <p>✓ Ethos Everywhere wallet only</p>
            <p>✓ Access based on credibility score & vouches</p>
            <p>✓ Transparent, reputation-first model</p>
          </div>
        </div>
      </div>
    </main>
  );
}