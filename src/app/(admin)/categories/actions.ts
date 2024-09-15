"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export const upsertCategory = async ({
  categoryData: { id, name },
}: {
  categoryData: { id?: string; name: string };
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Check for existing category by name
    const existingCategoryByName = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategoryByName && existingCategoryByName.id !== id) {
      throw new Error("Category name already in use.");
    }

    await prisma.category.upsert({
      where: { id: id || "" },
      update: {
        name,
        updatedAt: new Date(),
      },
      create: {
        name,
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

export const deleteCategory = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
