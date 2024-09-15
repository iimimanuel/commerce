"use server"

import prisma from "@/lib/prisma";


export const getContent = async (title: string) => {
  try {
    const content = await prisma.content.findUnique({ where: { title } });
    return content?.description || "no data";
  } catch (error) {
    console.error("Error fetching logo:", error);
    return "Error Loading Logo";
  }
}
