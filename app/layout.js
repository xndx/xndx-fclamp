import './globals.css'

export const metadata = {
  title: 'xndx fclamp',
  description:
    'Generate a responsive clamp size based on your min and max values.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
