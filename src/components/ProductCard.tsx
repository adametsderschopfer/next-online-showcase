'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  pictures?: string; 
}

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    console.log(`Добавить в корзину: ${product.name} (ID: ${product.id})`);
  };

  let imageUrl = '';
  if (product.pictures) {
    try {
      const pics = JSON.parse(product.pictures);
      if (Array.isArray(pics) && pics.length > 0 && pics[0].url) {
        imageUrl = pics[0].url;
      }
    } catch (e) {
      console.error('Ошибка парсинга pictures JSON', e);
    }
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <Link href={`/catalog/product/${product.id}`} className="flex flex-col flex-grow">
        <CardHeader>
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              'Изображение'
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          {product.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center">
        {product.price !== null && product.price !== undefined ? (
          <span className="text-xl font-bold">{product.price.toFixed(2)} руб.</span>
        ) : (
          <span className="text-md text-gray-700">Цена не указана</span>
        )}
        <Button onClick={handleAddToCart}>В корзину</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard; 