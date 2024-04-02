import Papa from 'papaparse';
import { Puzzle } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRandomPuzzle = async ()=> {
  const ret = await prisma.puzzles.findFirst({
    orderBy: {
      puzzle_id: 'asc',
    },
    skip: Math.floor(Math.random() * (await prisma.puzzles.count()))
  });
  console.log("Returning: ", ret);
  return ret;
}

export default prisma;
