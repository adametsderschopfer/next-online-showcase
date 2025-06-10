import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

interface Params {
  path: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries: number = 10): Promise<ArrayBuffer> => {
  const username = process.env.GIFTS_RU_LOGIN;
  const password = process.env.GIFTS_RU_PASSWORD;

  let attempt = 0;

  while (attempt < retries) {
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      return await res.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      attempt++;
      if (attempt < retries) {
        await delay(800);
      }
    }
  }

  throw new Error('Не удалось загрузить изображение после нескольких попыток');
};

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  const { path } = await params;

  const imagePath = path.join('/');
  const externalUrl = `https://api2.gifts.ru/export/v2/catalogue/thumbnails/${imagePath}`;

  try {
    const imageBuffer = await fetchWithRetry(externalUrl);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при загрузке изображения' }, { status: 500 });
  }
}
