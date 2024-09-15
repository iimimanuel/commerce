"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isActive = true;

    const id = url.searchParams.get("id") as string;


    if (!id) return Response.json({ error: "no id" }, { status: 401 });

    const where = { isActive, id };

    const products = await prisma.product.findFirst({
      where,
      select: productSelect,
    });

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
