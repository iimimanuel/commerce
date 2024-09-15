"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export const upsertContent = async ({
  contentData: { id, title, description },
}: {
  contentData: { id?: number; title: string; description: string };
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingContentByTitle = await prisma.content.findUnique({
      where: { title },
    });

    if (existingContentByTitle && existingContentByTitle.id !== id) {
      throw new Error("Content title already in use.");
    }

    await prisma.content.upsert({
      where: { id: id  },
      update: {
        title,
        description,
        updatedAt: new Date(),
      },
      create: {
        title,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};

export const deleteContent = async ({ contentId }: { contentId: number }) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingContent = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!existingContent) {
      throw new Error("Content not found");
    }

    await prisma.content.delete({
      where: { id: contentId },
    });

  
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
