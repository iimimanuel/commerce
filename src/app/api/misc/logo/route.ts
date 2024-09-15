"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const logo = await prisma.content.findUnique({
      where: { title: "logo" },
    });

    const response = logo
      ? {
          id: logo.id,
          title: logo.title,
          description: logo.description,
          createdAt: logo.createdAt.toISOString(), // Convert Date to ISO string
          updatedAt: logo.updatedAt.toISOString(), // Convert Date to ISO string
        }
      : {
          id: 0,
          title: "",
          description: "",
          createdAt: new Date().toISOString(), // Default date as ISO string
          updatedAt: new Date().toISOString(), // Default date as ISO string
        };

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching logo:", error);
    return NextResponse.json({ error: "Error Loading Logo" }, { status: 500 });
  }
}
