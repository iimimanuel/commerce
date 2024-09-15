"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Metadata } from "next";
import { CategoryData, ProductData } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/(components)/navbar";
import Link from "next/link";
import Content from "./(components)/content";
import Categories from "./(components)/categories";
import Footer from "../(components)/Footer";
// export const metadata: Metadata = {
//   title: "Login",
// };

export default function Page() {
  const [variantIndex, setVariantIndex] = useState(0);

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
  

  return (
    <main className="bg-card-foreground flex h-screen justify-center">
      <div className="lg:w-[1300px] w-[80vw] space-y-4">
        <Navbar />
        <Categories/>
        <Content />
        <Footer/>
      </div>
    </main>
  );
}
