"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductData } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { setCookie } from "./actions";
import { ToasterCenter, toastError, toastSuccess } from "@/app/utils/toaster";

export default function Details() {
  const [variantIndex, setVariantIndex] = useState(0);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const queryProducts = useQuery<ProductData>({
    queryKey: ["productDetails"],
    queryFn: async () => {
      const res = await fetch(`/api/products/public/first?id=${id}`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (queryProducts.isLoading) {
    return (
      <div className="flex flex-col justify-center lg:flex-row">
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2">
          <div className="flex w-full space-x-2 overflow-x-auto scrollbar-hide lg:h-[600px] lg:w-auto lg:flex-col lg:space-x-0 lg:space-y-4 lg:overflow-x-hidden lg:overflow-y-scroll">
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
            <div className="skeleton relative h-16 w-16 flex-shrink-0 bg-base-200"></div>
          </div>

          <div className="carousel flex h-[300px] w-full flex-row lg:h-[600px] lg:w-[600px]">
            <div className="carousel-item skeleton relative h-[300px] w-full bg-base-200 lg:h-[600px] lg:w-[600px]"></div>
          </div>
        </div>

        <div className="flex h-[600px] flex-1 flex-col space-y-4 p-4 lg:overflow-y-auto">
          <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>

          <div className="skeleton h-[30px] w-full bg-base-200 text-2xl font-semibold"></div>
          <div className="space-y-3">
            <div className="skeleton h-[30px] w-full bg-base-200 font-medium"></div>
            <div className="grid grid-cols-5 gap-4">
              <div className={"btn skeleton rounded-sm bg-base-200"}></div>
              <div className={"btn skeleton rounded-sm bg-base-200"}></div>
              <div className={"btn skeleton rounded-sm bg-base-200"}></div>
              <div className={"btn skeleton rounded-sm bg-base-200"}></div>
              <div className={"btn skeleton rounded-sm bg-base-200"}></div>
            </div>
            <div className="btn skeleton col-span-3 w-full rounded-full bg-base-200 p-4 font-bold text-primary-content transition-colors"></div>
          </div>

          <div className="h-[400px] space-y-2 overflow-y-auto pt-7 text-left scrollbar-hide">
            <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>
            <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>
            <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>
            <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>
            <div className="skeleton h-[30px] w-full bg-base-200 text-3xl font-bold"></div>
          </div>
        </div>
      </div>
    );
  }

  if (queryProducts.isError) {
    return <div>Error: {(queryProducts.error as Error).message}</div>;
  }

  if (!queryProducts.data) {
    return <div>No products found.</div>;
  }

  const products = queryProducts.data;

  const handleAddingCart = async (vairantId: string) => {
    const result = await setCookie(vairantId);

    if (result) return toastError(result.error.message);
    toastSuccess("Item Added to Cart");
    queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
  };

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ block: "nearest", inline: "center" });
    }
  };



  
  return (
    <div className="flex flex-col justify-center lg:flex-row">
      <ToasterCenter />

      <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2">
        <div className="flex w-full space-x-2 overflow-x-auto scrollbar-hide lg:h-[600px] lg:w-auto lg:flex-col lg:space-x-0 lg:space-y-4 lg:overflow-x-hidden lg:overflow-y-scroll">
          {products.Variant[variantIndex].images.map((image, index) => (
            <a
              key={index}
              onClick={() => handleScrollTo(`item${index}`)}
              // href={`#item${index}`}
              className="relative h-16 w-16 flex-shrink-0"
            >
              <Image
                layout="fill"
                src={image}
                className="h-full w-full rounded-md object-cover"
                alt={`Thumbnail ${index}`}
              />
            </a>
          ))}
        </div>

        <div className="carousel flex h-[300px] w-full flex-row bg-primary lg:h-[600px] lg:w-[600px]">
          {products.Variant[variantIndex].images.map((image, index) => (
            <div
              key={index}
              id={`item${index}`}
              className="carousel-item relative h-[300px] w-full lg:h-[600px] lg:w-[600px]"
            >
              <Image
                layout="fill"
                src={image}
                className="h-full w-full object-cover"
                alt={`Carousel item ${index}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-[600px] flex-1 flex-col space-y-4 p-4 lg:overflow-y-auto">
        <h1 className="text-3xl font-bold">{products.name}</h1>

        <div className="text-2xl font-semibold">
          Rp{products.Variant[variantIndex].price}
        </div>
        <div className="space-y-3">
          <div className="font-medium">Select:</div>
          <div className="grid grid-cols-5 gap-4">
            {products.Variant.map((variant, index) => (
              <button
                disabled={variant.stock == 0}
                className={
                  index == variantIndex
                    ? "btn btn-primary rounded-sm"
                    : "btn rounded-sm border-2 border-primary bg-base-100 hover:btn-primary"
                }
                key={index}
                onClick={() => setVariantIndex(index)}
              >
                {variant.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleAddingCart(products.Variant[variantIndex].id)}
            className="btn btn-primary col-span-3 w-full rounded-full p-4 font-bold text-primary-content transition-colors"
          >
            Add to Cart
          </button>
        </div>

        <div
          className="h-[400px] overflow-y-auto pt-7 text-left scrollbar-hide"
          dangerouslySetInnerHTML={{ __html: products.description }}
        ></div>
      </div>
    </div>
  );
}
