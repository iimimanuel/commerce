"use server";

import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isActive = true;

    const where = { isActive };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 2,
      select: productSelect,
    });

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
