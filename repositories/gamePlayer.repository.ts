import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GamePlayerRepository = {
  create: async (gameId: string, playerId: string, color: string, turnIndex: number) => {
    return prisma.gamePlayer.create({
      data: { gameId, playerId, color, turnIndex },
    });
  },

  findByGameId: async (gameId: string) => {
    return prisma.gamePlayer.findMany({
      where: { gameId },
    });
  },
};
