'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { IProduct, IProductVariant } from '@/types/models';

interface Category {
  id: string;
  name: string;
  link: string;
}

interface DisplayProductData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  pictures?: string;
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

  const products: DisplayProductData[] = [
    {
      id: 'prod-1',
      name: 'Товар 1',
      description: 'Это описание товара 1. Длинное описание, чтобы проверить, как оно обрезается.',
      price: 123.45,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/A78BFA/ffffff?text=Product+1' }]),
    },
    {
      id: 'prod-2',
      name: 'Очень длинное название товара 2, чтобы проверить перенос строки',
      description: 'Короткое описание.',
      price: 999.99,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/FCA5A5/ffffff?text=Product+2' }]),
    },
    {
      id: 'prod-3',
      name: 'Товар 3 (Без цены)',
      description: 'Товар без указания цены.',
      price: undefined,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/FDBA74/ffffff?text=Product+3' }]),
    },
    {
      id: 'prod-4-variant',
      name: 'Товар 4 (Вариант)',
      description: 'Описание варианта товара 4.',
      price: 555.00,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/67E8F9/ffffff?text=Product+4+Variant' }]),
    },
    {
      id: 'prod-5',
      name: 'Товар 5',
      description: 'Описание товара 5.',
      price: 250.75,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/C4B5FD/ffffff?text=Product+5' }]),
    },
    {
      id: 'prod-6',
      name: 'Товар 6',
      description: 'Описание товара 6.',
      price: 400.00,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/A78BFA/ffffff?text=Product+6' }]),
    },
    {
      id: 'prod-7',
      name: 'Товар 7',
      description: 'Описание товара 7.',
      price: 150.50,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/FCA5A5/ffffff?text=Product+7' }]),
    },
    {
      id: 'prod-8',
      name: 'Товар 8',
      description: 'Описание товара 8.',
      price: 600.20,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/FDBA74/ffffff?text=Product+8' }]),
    },
    {
      id: 'prod-9',
      name: 'Товар 9',
      description: 'Описание товара 9.',
      price: 75.00,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/67E8F9/ffffff?text=Product+9' }]),
    },
    {
      id: 'prod-10',
      name: 'Товар 10',
      description: 'Описание товара 10.',
      price: 320.90,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/C4B5FD/ffffff?text=Product+10' }]),
    },
    {
      id: 'prod-11',
      name: 'Товар 11',
      description: 'Описание товара 11.',
      price: 88.88,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/A78BFA/ffffff?text=Product+11' }]),
    },
    {
      id: 'prod-12',
      name: 'Товар 12',
      description: 'Описание товара 12.',
      price: 111.11,
      pictures: JSON.stringify([{ url: 'https://via.placeholder.com/300/FCA5A5/ffffff?text=Product+12' }]),
    },
  ];

  return (
    <div className="flex mt-6 items-start">
      <aside className="w-[300px] mr-8 sticky top-0">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
} 