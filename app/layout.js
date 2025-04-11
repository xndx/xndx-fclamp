import './globals.css'

export const metadata = {
  title: 'xndx fclamp',
  description:
    'Generate a responsive clamp size based on your min and max values.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
