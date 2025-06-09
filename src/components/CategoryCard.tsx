'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ICategory} from "../../types";

interface CategoryCardProps {
  category: ICategory & {
    subCategories: ICategory[]
  }
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link href={`/catalog/${category.id}`} className="hover:underline">
            {category.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-sm text-gray-600">
        {category.subCategories.map((subCat, index) => (
          <React.Fragment key={index}>
            <Link href={`/catalog/${encodeURIComponent(subCat.id)}`} className="hover:underline">
              {subCat.name}
            </Link>
            {index < category.subCategories.length - 1 && " • "}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryCard; 
