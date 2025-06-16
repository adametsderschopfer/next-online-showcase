'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import useSWR from 'swr';
import { ICategory, IProduct } from "../../../../../types";
import { Row, Col, Typography, Button, Spin, Drawer } from 'antd';

const { Title, Text } = Typography;

const fetchProducts = async (categoryId: string, page: number) => {
  const res = await fetch(`/api/catalog/${categoryId}?page=${page}&limit=16`);
  return await res.json();
};

const fetchSubCategories = async (categoryId: string) => {
  const res = await fetch(`/api/catalog/${categoryId}/nested`);
  if (!res.ok) {
    throw new Error('Ошибка при загрузке подкатегорий');
  }
  return res.json();
};

const ProductListPage = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const categoryId = React.use(params).categoryId;
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);

  const { data, error, isLoading } = useSWR(
    categoryId ? `/api/catalog/${categoryId}?page=${page}&limit=16` : null,
    () => fetchProducts(categoryId, page)
  );

  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992); // Проверка, является ли устройство мобильным
    };

    handleResize(); // Инициализация на старте
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [categoryId]);

  useEffect(() => {
    if (data && data.products.length > 0) {
      setAllProducts((prevProducts) => [...prevProducts, ...data.products]);
    }
  }, [data]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleOpenDrawer = () => {
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <>
      {subCategories.length > 0 && isMobile && (
        <Button
          type="primary"
          style={{
            width: '100%',
            marginBottom: '16px',
          }}
          onClick={handleOpenDrawer}
        >
          Категории
        </Button>
      )}

      <Row gutter={[16, 16]}>
        {subCategories.length > 0 && !isMobile && (
          <Col xs={24} sm={6} md={6} lg={5}>
            <aside style={{ marginBottom: '16px' }}>
              <Title level={4}>Категории</Title>
              <nav>
                <ul>
                  {subCategories.map((category) => (
                    <li key={category.id} style={{ marginBottom: '8px' }}>
                      <Link href={`/catalog/${category.id}`}>
                        <Text strong>{category.name}</Text>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </Col>
        )}

        <Col xs={24} sm={18} md={18} lg={subCategories.length > 0 ? 19 : 24}>
          {allProducts.length !== 0 || isLoading ? (
            <>
              <Title level={2}>Товары</Title>

              {error && <Text type="danger">Ошибка загрузки товаров.</Text>}
              {isLoading && <Spin size="large" />}

              <Row gutter={[16, 16]} justify="space-between" align="stretch">
                {allProducts.map((product: IProduct) => (
                  <Col key={`${product.categoryId}_${product.id}`} xs={24} sm={12} lg={8} xl={6}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {data && allProducts.length < data.totalCount && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Button
                    onClick={handleLoadMore}
                    type="primary"
                    size="large"
                    loading={isLoading}
                  >
                    Загрузить еще
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Text>Нет товаров в этой категории.</Text>
          )}
        </Col>
      </Row>

      <Drawer
        title="Категории"
        placement="left"
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
        width={300}
      >
        <ul>
          {subCategories.map((category) => (
            <li key={category.id} style={{ marginBottom: '8px' }}>
              <Link href={`/catalog/${category.id}`}>
                <Text strong>{category.name}</Text>
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};

export default ProductListPage;
