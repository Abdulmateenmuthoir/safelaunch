'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#6366f1',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'off',
          },
        },
        externalWallets: {
          ethos: {
            enabled: true,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}