'use client';

import React from 'react';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  // Создаем массив из 12 фиктивных данных для карточек
  const dummyCategories = Array.from({ length: 12 }).map((_, index) => ({
    id: `cat-${index}`,
    name: `Категория ${index + 1}`,
    level0Link: `/catalog/category-${index + 1}`, // Пример ссылки
    level1Categories: [
      `Подкатегория ${index + 1}.1`,
      `Подкатегория ${index + 1}.2`,
      `Подкатегория ${index + 1}.3`,
    ],
  }));

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Категории товаров</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyCategories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
