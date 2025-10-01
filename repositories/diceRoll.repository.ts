import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DiceRollRepository = {
  create: async (gameId: string, playerId: string, rollValue: number) => {
    return prisma.diceRoll.create({
      data: { gameId, playerId, rollValue },
    });
  },

  findByGameId: async (gameId: string) => {
    return prisma.diceRoll.findMany({ where: { gameId } });
  },
};
