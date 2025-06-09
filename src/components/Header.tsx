'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto max-w-[1440px] px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-white hover:opacity-80 flex items-center">
            <span className="text-xl font-bold">Логотип</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-sm">+7 (900) 000 00 00</span>
          <Link href="/checkout" className="text-white hover:opacity-80 flex items-center space-x-3 relative">
            <span>Корзина</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 
