'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import Link from 'next/link';
import { ICategory } from "../../types";

interface CategoryCardProps {
  category: ICategory & {
    subCategories: ICategory[];
  };
}

const { Title, Text } = Typography;

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="category-card">
      <Title level={4}>
        <Link href={`/catalog/${category.id}`} passHref>
          {category.name}
        </Link>
      </Title>
      <div className="subcategories">
        {category.subCategories.map((subCat, index) => (
          <React.Fragment key={subCat.id}>
            <Text>
              <Link href={`/catalog/${encodeURIComponent(subCat.id)}`} passHref>
                {subCat.name}
              </Link>
            </Text>
            {index < category.subCategories.length - 1 && <span> • </span>}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default CategoryCard;
