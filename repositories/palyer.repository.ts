import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PlayerRepository = {
  create: async (name: string) => {
    return prisma.player.create({
      data: { name },
    });
  },

  findAll: async () => {
    return prisma.player.findMany();
  },

  findById: async (id: string) => {
    return prisma.player.findUnique({
      where: { id },
    });
  },
};
