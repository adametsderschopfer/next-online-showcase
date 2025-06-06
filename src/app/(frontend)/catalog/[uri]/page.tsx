'use client';

import React from 'react';
import Link from 'next/link';

interface SubCategory {
  id: string;
  name: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
  link: string;
}

export default function ProductListPage() {
  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Категория 1 (Level 0)',
      link: '/catalog/cat-1',
    },
    {
      id: 'cat-2',
      name: 'Категория 2 (Level 0)',
      link: '/catalog/cat-2',
    },
  ];

  return (
    <div className="flex mt-6 items-start">
      <aside className="w-64 mr-8 sticky top-0">
        <h2 className="text-xl font-semibold mb-4">Категории</h2>
        <nav>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="mb-2">
                <Link href={category.link} className="font-medium hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-6">Страница списка товаров</h1>
        <p>Список товаров для категории/подкатегории [uri]</p>
        {[...Array(50)].map((_, i) => <p key={i}>Тестовый контент для прокрутки {i + 1}</p>)}
      </div>
    </div>
  );
} 