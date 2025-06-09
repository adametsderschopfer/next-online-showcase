import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ categoryId: string } >}) {
  const { categoryId } = await params;

  try {
    const subCategories = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subCategories: true,
      },
    });

    if (!subCategories) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
    }

    return NextResponse.json(subCategories.subCategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при получении подкатегорий' }, { status: 500 });
  }
}
