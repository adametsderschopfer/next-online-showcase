import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get('limit') || '10';
  const page = searchParams.get('page') || '1';

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  let products = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  if (products.length === 0) {
    const subCategories = await prisma.category.findMany({
      where: {
        parentId: categoryId,
      },
      select: {
        id: true,
      },
    });

    if (subCategories.length > 0) {
      const subCategoryIds = subCategories.map(subCategory => subCategory.id);
      products = await prisma.product.findMany({
        where: {
          categoryId: {
            in: subCategoryIds,
          },
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
    }
  }

  const totalCount = await prisma.product.count({
    where: {
      categoryId: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        in: products.length === 0 ? [] : [categoryId, ...products.map(p => p.categoryId)],
      },
    },
  });

  return NextResponse.json({
    products,
    totalCount,
  });
}
