"use client";

import { useQuery } from "@tanstack/react-query";
// import { Metadata } from "next";
import { ProductData } from "@/lib/types";
import { useParams } from "next/navigation";
import Navbar from "@/app/(components)/navbar";
import Link from "next/link";
import Image from "next/image";

export default function SimmilarProduct() {
  const { id } = useParams();

  const queryProducts = useQuery<ProductData[]>({
    queryKey: ["simmilarProduct", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/public/simmilar?amount=8&id=${id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (queryProducts.isLoading) {
    return (
      <>
        <div className="my-10 font-black">SIMMILAR PRODUCTS</div>
        <div className="my-4 flex snap-x flex-row space-x-4 overflow-x-hidden">
          <div className="flex flex-col space-y-2">
            <div className="skeleton relative h-[200px] w-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-80 lg:w-80"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="skeleton relative h-[200px] w-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-80 lg:w-80"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="skeleton relative h-[200px] w-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-80 lg:w-80"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="skeleton relative h-[200px] w-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-80 lg:w-80"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
            <div className="skeleton h-[20px] w-full font-semibold"></div>
          </div>
        </div>
      </>
    );
  }

  if (queryProducts.isError) {
    return <div>Error: {(queryProducts.error as Error).message}</div>;
  }

  if (!queryProducts.data) {
    return <div>No products found.</div>;
  }

  const products = queryProducts.data;

  return (
    <>
      <div className="my-10 font-black">SIMMILAR PRODUCTS:</div>
      <div className="my-2 flex snap-x flex-row space-x-4 overflow-x-auto">
        {products.map((product, index) => (
          <div key={index} className="flex flex-col">
            <Link
              href={`/details/${product.id}`}
              className="relative h-[200px] w-[200px] flex-shrink-0 snap-start lg:h-80 lg:w-80"
            >
              <Image
                layout="fill"
                src={product.Variant[0].images[0]}
                className="h-full w-full rounded-md object-cover"
                alt={`Thumbnail ${index}`}
              />
            </Link>
            <div className="font-semibold">{product.name}</div>
            <div className="font-semibold">Rp {product.Variant[0].price}</div>
          </div>
        ))}
      </div>
    </>
  );
}
