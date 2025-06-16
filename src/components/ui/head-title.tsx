'use client'

import React from 'react';
import Head from 'next/head';
import { Typography } from 'antd';

const { Title } = Typography;

interface HeadTitleProps {
  title: string;
}

const HeadTitle: React.FC<HeadTitleProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        {title}
      </Title>
    </>
  );
};

export default HeadTitle;
