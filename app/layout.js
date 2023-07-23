
import './globals.css'
import { Roboto_Flex } from 'next/font/google'
import NavBar from "../components/navBar/navBar"

const robotFlex = Roboto_Flex({ 
  weight: ['400', '500', '600'],
  subsets: ['latin']
})

const hideButton = false

export const metadata = {
  title: 'WanderAI',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/favicon.ico'/>
      </head>
      <body className={robotFlex.className}>
        <NavBar hideButton={hideButton}/>
        {children}
      </body>
    </html>
  )
}
