'use client';

import React, { useState, useEffect } from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {addToCart, getCartItems} from '@/lib/cart';
import {IProduct} from "../../types";
import {formatRubCurrency} from "@/lib/format";

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
      <div className="flex flex-col flex-grow">
        <CardHeader>
          <div className="w-full h-71 bg-gray-200 flex items-center justify-center text-gray-500">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              'Изображение'
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between items-center">
        {product.price !== null && product.price !== undefined ? (
          <span className="text-xl font-bold">{formatRubCurrency(product.price)}</span>
        ) : (
          <span className="text-md text-gray-700">Цена не указана</span>
        )}
        <Button onClick={handleAddToCart} disabled={isInCart} style={{cursor: "pointer"}}>
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
