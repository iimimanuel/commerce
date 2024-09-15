"use client";

import { ProductData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const ProductHome = () => {
  const queryProducts = useQuery<ProductData[]>({
    queryKey: ["productsHome"],
    queryFn: async () => {
      const res = await fetch(`/api/products/public`);
      console.log(res);

      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (queryProducts.isLoading) {
    return (
      <div className="flex w-full items-center justify-center ">
        <div className="h-4 w-4 animate-spin bg-primary"></div>
      </div>
    );
  }

  if (!queryProducts.data) {
    return (
      <div className="flex w-full items-center justify-center">
        No Products Found
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row space-x-4 overflow-x-auto overflow-y-hidden lg:grid lg:flex-none lg:grid-cols-3 lg:gap-x-2 lg:gap-y-4 lg:space-x-0">
      {queryProducts.data.map((product, index) => (
        <Link
          prefetch={false}
          href={`/details/${product.id}`}
          key={index}
          className="group flex-col space-y-3"
        >
          <div className="relative flex h-[400px] w-[80vw] lg:h-[600px] lg:w-full">
            <Image
              layout="fill"
              src={product.Variant[0].images[0] || ""}
              className="h-full w-full rounded-2xl bg-primary object-cover transition-all ease-in-out group-hover:brightness-50"
              alt={`variant${index}`}
            />
          </div>

          <div className="flex flex-col justify-start space-y-3">
            <div className="text-4xl font-bold">{product.name}</div>
            <div className="text-4xl font-bold">
              Rp {product.Variant[0].price}
            </div>
          </div>
        </Link>
      ))}
      <Link
        prefetch={false}
        href={"/explore"}
        className="relative flex h-[400px] items-center justify-center rounded-xl bg-primary p-4 text-xl font-semibold text-white lg:col-span-3 lg:h-[50px] lg:w-full"
      >
        See More
      </Link>
    </div>
  );
};

export default ProductHome;
