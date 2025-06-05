'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    level0Link: string;
    level1Categories: string[];
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link href={category.level0Link} className="hover:underline">
            {category.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-sm text-gray-600">
        {category.level1Categories.map((subCat, index) => (
          <React.Fragment key={index}>
            <Link href={`/catalog/${encodeURIComponent(subCat)}`} className="hover:underline">
              {subCat}
            </Link>
            {index < category.level1Categories.length - 1 && " • "}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryCard; 