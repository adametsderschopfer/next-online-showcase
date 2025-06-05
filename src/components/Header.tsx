'use client';

import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto max-w-[1440px] px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">Логотип</span>
        </div>

        <div>
          <span className="text-sm">+7 (900) 000 00 00</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 