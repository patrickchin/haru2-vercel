import './globals.css';

import { GeistSans } from 'geist/font/sans';
import { SessionProvider } from "next-auth/react"

let title = 'Haru Construct';
let description =
  'Plan and organise and your construction projects';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://haru2-kappa.vercel.app'),
  // metadataBase: new URL('https://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>
          {children}
      </body>
    </html>
  );
}
