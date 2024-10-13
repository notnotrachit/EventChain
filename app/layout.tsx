import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/components/web3-provider";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decentralized Event Platform',
  description: 'A Web3-powered event platform on the Base network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Provider>
            <Header />

            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}