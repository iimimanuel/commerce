"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Metadata } from "next";
import { CategoryData, ProductData } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/(components)/navbar";
import Link from "next/link";
// export const metadata: Metadata = {
//   title: "Login",
// };

export default function Categories() {

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const queryCategories = useQuery<CategoryData[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`/api/categories/public`);
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (queryCategories.isLoading) {
    return (
      <div className="flex w-full flex-row space-x-2 overflow-y-hidden">
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
        <div className="btn skeleton h-10 w-[100px] rounded-full bg-base-200"></div>
      </div>
    );
  }

  if (queryCategories.isError) {
    return <div>Error: {(queryCategories.error as Error).message}</div>;
  }

  if (!queryCategories.data) {
    return <div>No products found.</div>;
  }

  return (
    <div className="flex w-full flex-row space-x-2 overflow-y-auto">
      <Link
        href={`/explore?filter=`}
        className="btn btn-primary h-10 rounded-full"
      >
        ALL
      </Link>
      {queryCategories.data?.map((category, index) => (
        <Link
          key={index}
          href={`/explore?filter=${category.id}`}
          className="btn btn-primary h-10 rounded-full"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
