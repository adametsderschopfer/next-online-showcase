import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  const searchParams = req.nextUrl.searchParams
  const limit = searchParams.get('limit') || '12'
  const page = searchParams.get('page') || '1'

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const products = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  const totalCount = await prisma.product.count({
    where: {
      categoryId: categoryId,
    },
  });

  return NextResponse.json({
    products,
    totalCount,
  });
}
