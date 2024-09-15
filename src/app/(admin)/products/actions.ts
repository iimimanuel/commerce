"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export const upsertProduct = async ({
  productData: {
    id,
    name,
    description,
    isActive,
    categories,
  },
}: {
  productData: {
    id: string;
    name: string;
    description: string;
    categories: [{id: string, name:string}];
    isActive: boolean;
  };
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }



    await prisma.product.upsert({
      where: { id },
      update: {
        name,
        description,
        isActive,
        updatedAt: new Date(),
        categories: {
          set: categories.map((category) => ({ id: category.id })),
        },
      },
      create: {
        id,
        name,
        description,
        isActive,
        createdAt: new Date(),
        categories: {
          connect: categories.map((category) => ({ id: category.id })),
        },
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

export const upsertVariant = async ({
  variantData: {
    id, 
    productId, 
    name, 
    price, 
    stock, 
    images,
  },
}: {
  variantData: {
    id?: string; 
    productId: string;
    name: string; 
    price: number; 
    stock: number; 
    images: string[]; 
  };
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }


    const isExist = await prisma.product.findFirst({where: {id: id}})

    if(!isExist) throw new Error("No Id Found");

   await prisma.variant.upsert({
      where: { id: id || "" }, 
      update: {
        name,
        price,
        stock,
        images,
      },
      create: {
        id: id , 
        productId, 
        name,
        price,
        stock,
        images,
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

export const deleteProduct = async ({ productId }: { productId: string }) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return {
      message: "Product deleted successfully",
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
