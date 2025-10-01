import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TokenRepository = {
  create: async (gameId: string, playerId: string, position = -1) => {
    return prisma.token.create({
      data: { gameId, playerId, position, isFinished: false },
    });
  },

  findByPlayerId: async (playerId: string) => {
    return prisma.token.findMany({
      where: { playerId },
    });
  },

  updatePosition: async (tokenId: string, position: number, isFinished: boolean) => {
    return prisma.token.update({
      where: { id: tokenId },
      data: { position, isFinished },
    });
  },
};
