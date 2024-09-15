import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { contentSelect, ContentData } from "@/lib/types";

export async function GET(request: Request) {
  try {

    const contents = await prisma.content.findMany({
      select: contentSelect,
    });

    return Response.json(contents);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
