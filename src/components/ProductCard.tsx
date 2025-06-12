'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Импортируем Image для оптимизации
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCart, getCartItems } from '@/lib/cart';
import { IProduct } from "../../types";
import { formatRubCurrency } from "@/lib/format";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isInCart, setIsInCart] = useState<boolean>(false);

  useEffect(() => {
    const cartItems = getCartItems();
    const isProductInCart = cartItems.some((item: IProduct) => item.id === product.id);
    setIsInCart(isProductInCart);
  }, [product.id]);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(product as IProduct);
      setIsInCart(true);
    }
  };

  let imageUrl = '/image/image-placeholder.webp'; // Заглушка по умолчанию
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

  const [imgError, setImgError] = useState<boolean>(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="flex flex-col flex-grow">
        <CardHeader>
          <div className="w-full h-[284px] bg-gray-200 flex items-center justify-center text-gray-500">
            <Image
              src={imgError ? '/image/image-placeholder.webp' : imageUrl}
              alt={product.name}
              width={284}
              height={284}
              className="object-contain h-284"
              onError={handleImageError}
              placeholder="blur"
              blurDataURL="/image/image-placeholder.webp"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          <CardDescription>
            {product.article && (
              <>
                <span> Артикул: {product.article}</span>
                <br />
              </>
            )}
            {product.brand && (
              <>
                <span> Бренд: {product.brand}</span>
                <br />
              </>
            )}
            {product.description && (
              <>
                <br />
                {(() => {
                  const LENGTH = 150;
                  const pd = product.description.substring(0, LENGTH);
                  return pd.length >= LENGTH ? `${pd}...` : product.description;
                })()}
              </>
            )}
          </CardDescription>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between items-center">
        {product.price !== null && product.price !== undefined ? (
          <span className="text-xl font-bold">{formatRubCurrency(product.price)}</span>
        ) : (
          <span className="text-md text-gray-700">Цена не указана</span>
        )}
        <Button onClick={handleAddToCart} disabled={isInCart} style={{ cursor: "pointer" }}>
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
