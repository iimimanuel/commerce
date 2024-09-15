"use server";

import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("filter");
    let take = Number(url.searchParams.get("amount")) || 3;

    let query: any = {
      select: productSelect,
      where: { isActive: true },

      take,
    };

    if (categoryId) {
      if (categoryId === "latest") {
        query.orderBy = {
          createdAt: "desc",
        };
      } else {
        query.where.categories = {
          some: { id: categoryId },
        };
      }
    }

    const products = await prisma.product.findMany(query);

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
