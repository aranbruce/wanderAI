
import './globals.css'
import { Raleway } from 'next/font/google'
import NavBar from "../components/navigation/navigation"
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script'

const raleway = Raleway({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

const hideButton = false

export const metadata = {
  title: 'WanderAI',
  description: 'Love travel but hate planning? Plan your next adventure in seconds through the power of AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/favicon.ico'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body className={raleway.className}>
        <NavBar hideButton={hideButton}/>
        {children}
        <Analytics/>
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-941301227" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'AW-941301227');
          `}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YNJJ4F6JVQ" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-YNJJ4F6JVQ');
          `}
        </Script>
      </body>
    </html>
  )
}
