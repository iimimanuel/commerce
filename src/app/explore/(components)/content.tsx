"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CategoryData, ProductData } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Page {
  products: ProductData[];
  hasMore: boolean;
}

export default function Content() {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  console.log(filter);

  const fetchProduct = async (page = 1) => {
    const res = await fetch(
      `/api/products/public/test?filter=${filter || ""}&amount=8&page=${page}`,
    );
    return res.json();
  };

  const {
    isPending,
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
  } = useQuery<Page>({
    queryKey: ["products", filter, page],
    queryFn: () => fetchProduct(page),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-2 gap-y-14 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-20">
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
        <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
          <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>No products found.</div>;
  }

  return (
    <div>
      {!isFetching ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-14 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-20">
          {data.products.map((product, index) => (
            <div
              key={index}
              className="flex h-[200px] flex-col rounded-xl lg:h-[400px]"
            >
              <Link
                href={`/details/${product.id}`}
                className="relative h-[200px] flex-shrink-0 snap-start lg:h-[400px]"
              >
                <Image
                  layout="fill"
                  src={product.Variant[0].images[0]}
                  className="h-full w-full rounded-xl object-cover transition-all ease-in-out hover:brightness-50"
                  alt={`Thumbnail ${index}`}
                />
              </Link>
              <div className="font-semibold">{product.name}</div>
              <div className="font-semibold">Rp {product.Variant[0].price}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-14 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-20">
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
          <div className="flex h-[200px] flex-col rounded-xl lg:h-[400px]">
            <div className="skeleton relative h-[200px] flex-shrink-0 snap-start bg-base-200 lg:h-[400px]"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
            <div className="skeleton h-[20px] w-full bg-base-200 font-semibold"></div>
          </div>
        </div>
      )}

      <div className="mt-20 flex w-full justify-between">
        <button
          className="btn"
          onClick={async () => {
            await setPage((old) => Math.max(old - 1, 0));
          }}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <button
          className="btn"
          onClick={async () => {
            if (!isPlaceholderData && data.hasMore) {
              await setPage((old) => old + 1);
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={isPlaceholderData || !data?.hasMore}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
