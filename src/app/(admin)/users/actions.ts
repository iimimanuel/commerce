"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  EDITOR = "EDITOR",
}

export const upsertUser = async ({
  userData: { id, username, email, role },
}: {
  userData: { id: string; username: string; email: string; role: Role };
}) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByUsername && existingUserByUsername.id !== id) {
      throw new Error("Username already in use.");
    }

    if (existingUserByEmail && existingUserByEmail.id !== id) {
      throw new Error("Email already in use.");
    }

    const password = crypto.randomBytes(16).toString("hex");
    const passwordHash = await bcrypt.hash(password, 5);

    await prisma.user.upsert({
      where: { id },
      update: {
        username,
        email,
        role,
        updatedAt: new Date(),
      },
      create: {
        id,
        username,
        passwordHash,
        name: role,
        email,
        role,
        createdAt: new Date(),
      },
    });
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error: any) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};
