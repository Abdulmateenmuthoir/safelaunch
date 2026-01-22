'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEthosScore, getEthosUser } from '@/lib/ethos';
import { determineAccess, AccessStatus } from '@/lib/utils';

export default function LaunchPage() {
  const { authenticated, ready, user, logout } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    address: string;
    score: number;
    vouches: number;
    access: AccessStatus;
  } | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const walletAddress = user?.wallet?.address;
        if (!walletAddress) {
          setError('No wallet address found');
          return;
        }

        const [scoreData, userData] = await Promise.all([
          getEthosScore(walletAddress),
          getEthosUser(walletAddress),
        ]);

        const score = scoreData.score ?? 0;
        const vouches = userData.stats.vouch.received.count;
        const access = determineAccess(score, vouches);

        setData({
          address: walletAddress,
          score,
          vouches,
          access,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ready, authenticated, user, router]);

  if (!ready || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 max-w-md">
          <p className="text-red-200 text-center">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-12 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Launch Access</h1>
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Wallet Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
          <p className="text-white font-mono text-sm break-all">{data.address}</p>
        </div>

        {/* Reputation Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Ethos Credibility Score</p>
            <p className="text-5xl font-bold text-white">{data.score}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <p className="text-gray-400 text-sm mb-2">Vouch Count</p>
            <p className="text-5xl font-bold text-white">{data.vouches}</p>
          </div>
        </div>

        {/* Access Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`${data.access.color} px-6 py-3 rounded-xl`}>
              <p className="text-white font-bold text-lg">{data.access.tier}</p>
            </div>
          </div>

          <p className="text-gray-200 text-lg leading-relaxed">
            {data.access.reason}
          </p>

          {data.access.tier === 'PRIORITY ACCESS' && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
              <p className="text-green-200 font-semibold mb-2">
                🎉 You qualify for priority access!
              </p>
              <p className="text-green-300 text-sm">
                You'll be among the first to participate in the token launch.
              </p>
            </div>
          )}

          {data.access.tier === 'WAITLIST' && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6">
              <p className="text-yellow-200 font-semibold mb-2">
                ⏳ You're on the waitlist
              </p>
              <p className="text-yellow-300 text-sm">
                Increase your vouches to gain priority access (need {5 - data.vouches} more).
              </p>
            </div>
          )}

          {data.access.tier === 'DENIED' && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
              <p className="text-red-200 font-semibold mb-2">
                ❌ Access not granted
              </p>
              <p className="text-red-300 text-sm">
                Build your Ethos reputation to qualify (need {1200 - data.score} more points).
              </p>
            </div>
          )}
        </div>

        {/* Criteria */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Access Criteria</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <p><strong>Priority Access:</strong> Score ≥ 1400 AND Vouches ≥ 5</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">⋯</span>
              <p><strong>Waitlist:</strong> Score ≥ 1200</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 mt-1">✗</span>
              <p><strong>Denied:</strong> Score &lt; 1200</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}