"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const setCookie = async (newItemId: string) => {
  try {
    const cookieStore = cookies();

    const currentCart = cookieStore.get("cart");
    let cart: string[] = currentCart ? JSON.parse(currentCart.value) : [];

    cart.push(newItemId);

    const countOccurrences = cart.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const variant = await prisma.variant.findUnique({
      where: { id: newItemId },
      select: { stock: true },
    });

    if (!variant || variant.stock < countOccurrences[newItemId]) {
      throw new Error("Insufficient stock");
    }

    cookieStore.set("cart", JSON.stringify(cart), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (error) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
