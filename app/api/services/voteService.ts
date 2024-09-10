import prisma from "@/app/lib/prisma";

export const vote = async (roundId: number, userId: string, isYes: boolean) => {
  try {
    const existingVote = await prisma.votes.findUnique({
      where: {
        roundId_userId: { roundId, userId },
      },
    });

    if (existingVote) {
      throw new Error("User has already voted in this round.");
    }

    const updateField = isYes
      ? { yes: { increment: 1 } }
      : { no: { increment: 1 } };

    const updatedRound = await prisma.round.update({
      where: { id: roundId },
      data: updateField,
    });

    await prisma.votes.create({
      data: {
        roundId,
        userId,
        voteType: isYes,
      },
    });

    return updatedRound;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to submit vote.");
  } finally {
    await prisma.$disconnect();
  }
};

export const undoVote = async (roundId: number, userId: string) => {
  try {
    const existingVote = await prisma.votes.findUnique({
      where: {
        roundId_userId: { roundId, userId },
      },
    });

    if (!existingVote) {
      throw new Error("User has not voted in this round.");
    }

    const updateField = existingVote.voteType
      ? { yes: { decrement: 1 } }
      : { no: { decrement: 1 } };

    const updatedRound = await prisma.round.update({
      where: { id: roundId },
      data: updateField,
    });

    await prisma.votes.delete({
      where: {
        roundId_userId: { roundId, userId },
      },
    });

    return updatedRound;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to undo vote.");
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchVote = async (roundId: number, userId: string) => {
  const existingVote = await prisma.votes.findUnique({
    where: {
      roundId_userId: { roundId, userId },
    },
  });

  return existingVote;
};
