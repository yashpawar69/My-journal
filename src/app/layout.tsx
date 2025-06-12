import type {Metadata} from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster"
import { APP_NAME } from '@/lib/constants';
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: APP_NAME,
  description: 'A blog application to create, read, update, and delete posts with AI-powered tag suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1 container py-8">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
