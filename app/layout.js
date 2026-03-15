import './globals.css'

export const metadata = {
  title: 'NextBol AI — Urdu & Roman Urdu Content Generator',
  description: 'Create viral Urdu and Roman Urdu content with AI. Generate YouTube scripts, social media posts, blogs, ads, and Islamic content in seconds.',
  keywords: 'Urdu AI writer, Roman Urdu generator, Urdu content generator, AI Urdu blog writer, Islamic content AI, Pakistani content tool',
  openGraph: {
    title: 'NextBol AI — Create Viral Urdu Content with AI',
    description: 'Generate YouTube scripts, captions, blogs and ads in Urdu and Roman Urdu in seconds.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
