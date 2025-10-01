import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TokenMoveRepository = {
  create: async (gameId: string, playerId: string, tokenId: string, fromPos: number, toPos: number, killedToken?: string) => {
    return prisma.tokenMove.create({
      data: { gameId, playerId, tokenId, fromPos, toPos, killedToken },
    });
  },

  findByGameId: async (gameId: string) => {
    return prisma.tokenMove.findMany({ where: { gameId } });
  },
};
