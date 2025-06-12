import React from 'react'
import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Проект 18.12',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const {children} = props

  return (
    <html lang="en">
    <body>
      <Header/>
      <div className="container mx-auto max-w-[1440px] px-4">
        <main>{children}</main>
      </div>
    </body>
    </html>
  )
}
