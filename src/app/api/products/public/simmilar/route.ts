"use server";

import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("id");
    const take = Number(url.searchParams.get("amount")) || 3;

    let query: any = {
      select: productSelect,
      where: { isActive: true },
      take,
    };

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categories: true },
      });

      if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }

      if (product.categories.length > 0) {
        query.where.categories = {
          some: { id: { in: product.categories.map((category) => category.id) } },
        };

        query.where.id = {
          not: productId,
        };

        const similarProducts = await prisma.product.findMany(query);
        return Response.json(similarProducts);
      }
    }

    return Response.json([]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
