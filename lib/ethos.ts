const ETHOS_API_BASE = 'https://api.ethos.network/api/v2';

export interface EthosScore {
  score?: number;
  level: string;
}

export interface EthosUser {
  id: number;
  score: number;
  stats: {
    vouch: {
      received: {
        count: number;
      };
    };
  };
}

export async function getEthosScore(address: string): Promise<EthosScore> {
  const res = await fetch(`${ETHOS_API_BASE}/score/address?address=${address}`);
  if (!res.ok) throw new Error('Failed to fetch score');
  return res.json();
}

export async function getEthosUser(address: string): Promise<EthosUser> {
  const res = await fetch(`${ETHOS_API_BASE}/user/by/address/${address}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}