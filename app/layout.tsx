import { SessionProvider } from 'next-auth/react';
import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { auth } from '@/lib/auth';

let title = 'Haru Construct';
let description = 'Plan and organise and your construction projects';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://haru2-kappa.vercel.app'),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth();

  return (
    <html lang="en">
      <body className={GeistSans.variable}>
        <SessionProvider session={session} >
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
