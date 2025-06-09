'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import useSWR from 'swr';
import {ICategory, IProduct} from "../../../../../types";

const fetchProducts = async (categoryId: string, page: number) => {
  const res = await fetch(`/api/catalog/${categoryId}?page=${page}&limit=32`);
  return await res.json();
};

const fetchSubCategories = async (categoryId: string) => {
  const res = await fetch(`/api/catalog/${categoryId}/nested`);
  if (!res.ok) {
    throw new Error('Ошибка при загрузке подкатегорий');
  }
  return res.json();
};

const ProductListPage = ({params}: { params: Promise<{ categoryId: string }> }) => {
  const categoryId = React.use(params).categoryId;
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]); // Храним все товары

  const {data, error, isLoading} = useSWR(
    categoryId ? `/api/catalog/${categoryId}?page=${page}&limit=16` : null,
    () => fetchProducts(categoryId, page)
  );

  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        const categories = await fetchSubCategories(categoryId);
        setSubCategories(categories);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };

    loadSubCategories();
  }, [categoryId]);

  useEffect(() => {
    if (data && data.products.length > 0) {
      setAllProducts((prevProducts) => [...prevProducts, ...data.products]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="flex flex-col mt-6 mb-8 items-start">
      {subCategories.length !== 0 && (
        <aside className="w-[300px] mb-5">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <nav>
            <ul>
              {subCategories.map((category) => (
                <li key={category.id} className="mb-2">
                  <Link href={`/catalog/${category.id}`} className="font-medium hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {allProducts.length !== 0 || allProducts.length === 0 && isLoading ? (
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">Страница списка товаров</h1>
          {error && <div>Ошибка загрузки товаров.</div>}
          {isLoading && <div>Загрузка...</div>}

          <div className="grid grid-cols-4 gap-6">
            {allProducts.map((product: IProduct) => (
              <ProductCard key={`${product.categoryId}_${product.id}`} product={product}/>
            ))}
          </div>

          {data && allProducts.length < data.totalCount && (
            <div className="text-center mt-8 py-5">
              <button onClick={handleLoadMore} className="text-blue-500 hover:underline py-4 px-4 cursor-pointer">
                Загрузить еще
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProductListPage;
