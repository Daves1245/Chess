import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if the table already exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'scores'
      );
    `;
    
    // @ts-ignore
    if (!tableExists[0].exists) {
      // Create the scores table
      await prisma.$executeRaw`
        CREATE TABLE "scores" (
          "id" SERIAL PRIMARY KEY,
          "handle" TEXT NOT NULL,
          "score" INTEGER NOT NULL
        );
      `;
      console.log('Scores table created successfully');
    } else {
      console.log('Scores table already exists');
    }
  } catch (error) {
    console.error('Error creating scores table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
