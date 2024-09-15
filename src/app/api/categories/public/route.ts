import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { categorySelect, CategoryData } from "@/lib/types";

export async function GET(request: Request) {
  try {

    const categories = await prisma.category.findMany({
      select: categorySelect,
      // take: 8
    });

    return Response.json(categories);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
