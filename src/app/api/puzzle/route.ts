import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ret = await getRandomPuzzle();

    if (!ret) {
      return NextResponse.json({ error: 'No puzzles found' }, { status: 404 });
    }

    return NextResponse.json(ret, { status: 200 });
  } catch (error) {
    console.error('Error fetching random puzzle:', error);
    return NextResponse.json({ error: 'Failed to fetch puzzle' }, { status: 500 });
  }
}

export const getRandomPuzzle = async () => {
  const ret = await prisma.$queryRaw`
    SELECT * FROM "puzzles" ORDER BY RANDOM() LIMIT 1;
  `;

  console.log('Returning:', ret[0]);
  return ret[0];
};
