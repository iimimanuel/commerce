"use server";
import { cookies } from "next/headers";

export async function removeItemFromCart(itemId: string) {
  try {
    const cookieStore = cookies();
    const cartCookie = cookieStore.get("cart");
    let cart = cartCookie ? JSON.parse(cartCookie.value) : [];

    const index = cart.indexOf(itemId);
    if (index > -1) {
      cart.splice(index, 1);
    }

    cookieStore.set("cart", JSON.stringify(cart), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
