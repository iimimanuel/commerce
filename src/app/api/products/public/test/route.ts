"use server";

import prisma from "@/lib/prisma";
import { productSelect } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("filter");
    const page = Number(url.searchParams.get("page")) || 1;
    const take = Number(url.searchParams.get("amount")) || 3;
    const skip = (page - 1) * take;

    let query: any = {
      select: productSelect,
      where: { isActive: true },
      take,
      skip,
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
    const totalProducts = await prisma.product.count({ where: query.where }); // Count total products for hasMore logic
    const hasMore = skip + take < totalProducts;

    return Response.json({ products, hasMore });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
