import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const siteName = 'ネガティブ・プリンティング（松本　新）';

export const metadata = {
  title: siteName,
  description: '',
  openGraph: {
    title: 'ネガティブ・プリンティング（松本　新）',
    description: '',
    url: 'https://negative-printing.aualrxse.com',
    siteName,
    locale: 'ja_JP',
    type: 'website',
    images: [{
      url: "https://negative-printing.aualrxse.com/og.png",
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: ''
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
