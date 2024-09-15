"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContentData } from "@/lib/types";
import { removeItemFromCart } from "./actions";

interface Variant {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  Variant: Variant[];
}

const Navbar = () => {
  const {
    data: logo,
    isLoading: isLoadingLogo,
    error: logoError,
  } = useQuery<ContentData>({
    queryKey: ["logo"],
    queryFn: async () => {
      const res = await fetch("/api/misc/logo");
      if (!res.ok) throw new Error("Error fetching logo");
      return res.json();
    },
  });

  const {
    data: cartProducts,
    isLoading: isLoadingCart,
    error: cartError,
  } = useQuery<Product[]>({
    queryKey: ["cartProducts"],
    queryFn: async () => {
      const res = await fetch("/api/misc/cart");
      if (!res.ok) throw new Error("Error fetching cart products");
      return res.json();
    },
  });

  const queryClient = useQueryClient();

  const handleRemoveItem = async (itemId: string) => {
    await removeItemFromCart(itemId);

    queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
  };

const totalPrice = cartProducts?.reduce((total, product) => {
  const productTotal = product.Variant.reduce((variantTotal, variant) => {
    return variantTotal + variant.price * variant.quantity;
  }, 0);

  return total + productTotal;
}, 0);

  return (
    <nav className="hero flex  h-10 lg:h-20 justify-between rounded-2xl border border-neutral p-4 my-4">
      <Link prefetch={false} href={"/"} className="lg:text-2xl  font-bold">
        {logo?.description}
      </Link>
      <div className="flex space-x-2 text-center">
        <div className="flex space-x-2 text-center">
          <div className="dropdown dropdown-end">
            <div
              role="button"
              tabIndex={0}
              className="btn-ghost hover:bg-base-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-cart"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] mt-3 w-[300px] space-y-2 rounded-box bg-base-100 p-4 shadow"
            >
              {cartProducts?.length === 0 ? (
                <div>No Items</div>
              ) : (
                cartProducts?.map((product, index) =>
                  product.Variant.map((variant, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex space-x-2">
                        <div>{variant.quantity}</div>
                        <div>{product.name}</div>
                        <div>{variant.name}</div>
                      </div>
                      <div className="flex space-x-2">
                        <div>Rp {variant.price}</div>
                        <button
                          className="hover:animate-bounce"
                          onClick={() => handleRemoveItem(variant.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )),
                )
              )}
              <div className="flex justify-between border-t border-black">
                <div className="flex space-x-2"></div>
                <div className="flex space-x-2">
                  <div>Total</div>
                  <div>Rp {totalPrice}</div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
