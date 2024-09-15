"use server";

import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let take = Number(url.searchParams.get("amount")) || 3;

    const totalProducts = await prisma.product.count();

    const randomOffset = Math.floor(Math.random() * totalProducts);

    let query: any = {
      select: productSelect,
      where: { isActive: true },
      skip: randomOffset,
      take,
    };

    const products = await prisma.product.findMany(query);

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
