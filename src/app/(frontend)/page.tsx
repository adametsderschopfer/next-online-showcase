import React from 'react';
import {getCategories} from "@/lib/actions/getCategories";
import CategoryCard from "@/components/CategoryCard";

const HomePage = async () => {
  const data = await getCategories();

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Категории товаров</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
