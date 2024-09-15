import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { VariantSelect, VariantData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");


    const variants = await prisma.variant.findMany({
      select: VariantSelect,
    });
    
    return Response.json(variants);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
