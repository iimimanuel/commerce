"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const cartCookie = cookieStore.get("cart");
    const variantIds = cartCookie
      ? JSON.parse(cartCookie.value).filter(
          (id: string) => id !== null && id !== undefined,
        )
      : [];

    const variantCountMap = variantIds.reduce(
      (acc: Record<string, number>, id: string) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {},
    );

    

    const variants = await prisma.variant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
      },
    });



    const productIds = Array.from(
      new Set(variants.map((variant) => variant.productId)),
    );

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        Variant: {
          where: {
            id: {
              in: variantIds,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    console.log(products);
    


    const response = products.map((product) => {
      return {
        ...product,
        Variant: product.Variant.map((variant) => ({
          ...variant,
          quantity: variantCountMap[variant.id] || 0,
        })),
      };
    });

    console.log(response);


    return Response.json(response);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return Response.json([], { status: 500 });
  }
}
