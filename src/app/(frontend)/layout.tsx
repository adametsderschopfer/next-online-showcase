import React from 'react'
import './globals.css'
import Header from '@/components/header/header'
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {Layout} from 'antd';

export const metadata = {
  title: 'Проект 18.12',
}

const RootLayout = ({children}: { children: React.ReactNode }) => {
  return (
    <html lang="en">
    <body>
    <AntdRegistry>
      <Header/>
      <Layout style={{maxWidth: '1440px', margin: '0 auto', padding: '16px' , backgroundColor: '#fff'}}>
        <main>{children}</main>
      </Layout>
    </AntdRegistry>
    </body>
    </html>
  )
}

export default RootLayout;
