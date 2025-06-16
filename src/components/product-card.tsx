'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Spin } from 'antd';
import Image from 'next/image';
import { addToCart, getCartItems } from '@/lib/cart';
import { IProduct } from "../../types";
import { formatRubCurrency } from "@/lib/format";

const { Title, Text } = Typography;

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

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

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <Card
      hoverable
      cover={
        <div className="image-container" style={{ height: '200px', position: 'relative' }}>
          <Image
            src={imgError ? '/image/image-placeholder.webp' : imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="/image/image-placeholder.webp"
          />
        </div>
      }
      style={{ overflow: 'hidden' }}
    >
      <Card.Meta
        title={<Title level={5}>{product.name}</Title>}
        description={
          <>
            {product.article && <Text>Артикул: {product.article}</Text>}
            <br />
            {product.brand && <Text>Бренд: {product.brand}</Text>}
            <br />
            {product.description && (
              <Text type="secondary">
                {product.description.length > 150 ? `${product.description.substring(0, 150)}...` : product.description}
              </Text>
            )}
          </>
        }
      />
      <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <div>
          {product.price !== null && product.price !== undefined ? (
            <Text strong>{formatRubCurrency(product.price)}</Text>
          ) : (
            <Text type="secondary">Цена не указана</Text>
          )}
        </div>
        <Button
          type="primary"
          onClick={handleAddToCart}
          disabled={isInCart}
          style={{ width: '100px' }}
        >
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
