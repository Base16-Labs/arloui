import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: {
    default: 'ArloUI',
    template: '%s — ArloUI',
  },
  description:
    'Copy-paste React Native components with strong defaults, full state coverage, and motion specs.',
  metadataBase: new URL('https://arloui.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,t=localStorage.getItem("arlo:theme"),s=matchMedia("(prefers-color-scheme:dark)").matches;if(t==="dark"||(t!=="light"&&s)){d.classList.add("dark");d.style.colorScheme="dark"}else{d.style.colorScheme="light"}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
