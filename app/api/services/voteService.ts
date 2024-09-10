import prisma from "@/app/lib/prisma";

export const vote = async (roundId: number, userId: string, isYes: boolean) => {
  try {
    // Check if the user has already voted in this round
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

export const hasVoted = async (roundId: number, userId: string) => {
  const existingVote = await prisma.votes.findUnique({
    where: {
      roundId_userId: { roundId, userId },
    },
  });

  return existingVote;
};
