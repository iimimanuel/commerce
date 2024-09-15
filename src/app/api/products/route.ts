import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { productSelect, ProductData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get("isActive");

    const isActive =
      isActiveParam === "true"
        ? true
        : isActiveParam === "false"
          ? false
          : undefined;

    const where = isActive !== undefined ? { isActive } : {};

    const products = await prisma.product.findMany({
      where,
      select: productSelect,
    });

    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
