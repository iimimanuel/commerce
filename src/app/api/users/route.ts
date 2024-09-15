import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userSelect, UserData } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: "SUPER_ADMIN" }, { role: "ADMIN" }],
      },
      select: userSelect,
    });
    

    return Response.json(users);
    
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
