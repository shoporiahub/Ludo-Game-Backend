import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GameRepository = {
  create: async (createdBy: string, maxPlayers: number) => {
    return prisma.game.create({
      data: {
        createdBy,
        maxPlayers,
        status: "WAITING",
      },
    });
  },

  findById: async (id: string) => {
    return prisma.game.findUnique({
      where: { id },
      include: { players: true, tokens: true },
    });
  },
};
