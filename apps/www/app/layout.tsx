import type { Metadata } from 'next';
import Script from 'next/script';
import '@fontsource-variable/manrope';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';
import { SearchProvider } from '@/components/search/search-provider';

const description =
  'Copy-paste React Native components with strong defaults, full state coverage, and motion specs.';

export const metadata: Metadata = {
  title: {
    default: 'ArloUI',
    template: '%s — ArloUI',
  },
  description,
  metadataBase: new URL('https://arloui.com'),
  openGraph: {
    type: 'website',
    siteName: 'ArloUI',
    url: 'https://arloui.com',
    title: 'ArloUI',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArloUI',
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement,t=localStorage.getItem("arlo:theme"),s=matchMedia("(prefers-color-scheme:dark)").matches;if(t==="dark"||(t!=="light"&&s)){d.classList.add("dark");d.style.colorScheme="dark"}else{d.style.colorScheme="light"}}catch(e){}})()`}
        </Script>
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <SearchProvider>{children}</SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
