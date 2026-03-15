import './globals.css'

export const metadata = {
  title: 'NextBol AI — Urdu & Roman Urdu Content Generator',
  description: 'Create viral Urdu and Roman Urdu content with AI. Generate YouTube scripts, social media posts, blogs, ads, and Islamic content in seconds. The #1 AI content platform for Pakistani creators.',
  keywords: 'Urdu AI writer, Roman Urdu generator, Urdu content generator, AI Urdu blog writer, Islamic content AI, Pakistani content tool, Urdu Facebook post generator, YouTube script Urdu',
  openGraph: {
    title: 'NextBol AI — Create Viral Urdu Content with AI',
    description: 'Generate YouTube scripts, captions, blogs & ads in Urdu and Roman Urdu — in seconds.',
    type: 'website',
    url: 'https://nextbol.com',
    siteName: 'NextBol AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextBol AI — Urdu Content Generator',
    description: 'Create viral Urdu content with AI in seconds.',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://nextbol.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
