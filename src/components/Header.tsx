'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  // В реальном приложении это число будет получено из состояния, контекста или пропсов.
  const cartItemCount = 3; // Пример: 3 товара в корзине

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
            <span className="relative">
              <ShoppingCart size={20} />
              {/* Счетчик товаров в корзине */}
              {/* Для примера используем число 3. В реальном приложении это будет переменная из состояния/контекста. */}
              {cartItemCount > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center z-10">
                  {cartItemCount} {/* Используем переменную */}
                </span>
              )}
            </span>
            <span>Корзина</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 