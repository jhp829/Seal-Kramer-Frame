import { Round } from "@prisma/client";
import prisma from "@/app/lib/prisma";

export const getRoundById = async (id: number): Promise<Round> => {
  try {
    const round = await prisma.round.findUnique({
      where: { id },
    });

    if (!round) {
      throw new Error(`Round with id ${id} not found`);
    }

    console.log("round", round);

    return round;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch the round");
  } finally {
    await prisma.$disconnect();
  }
};
