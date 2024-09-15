"use client";

import { useEffect, useState } from "react";
import { getContent } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ProductData } from "@/lib/types";

const Hero = () => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const content = async (title: string) => {
      const selectedContent = await getContent(title);
      setTitle(selectedContent);
    };
    const content1 = async (title: string) => {
      const selectedContent = await getContent(title);
      setAbout(selectedContent);
    };
    content("top");
    content1("middle");
  }, []);

  const queryLatestProduct = useQuery<ProductData[]>({
    queryKey: ["latestProduct"],
    queryFn: async () => {
      const res = await fetch(`/api/products/public/latest`);

      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  const queryRandomProduct = useQuery<ProductData[]>({
    queryKey: ["randomProduct"],
    queryFn: async () => {
      const res = await fetch(`/api/products/public/random?amount=5`);

      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

useEffect(() => {
  const goToOtherImage = (href: string, carouselId: string) => {
    const carousel = document.getElementById(carouselId);
    const target = document.querySelector<HTMLDivElement>(href);

    if (carousel && target) {
      const left = target.offsetLeft;
      carousel.scrollTo({ left: left });
    }
  };

  const intervalId = setInterval(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % 4; // Update the index correctly
      goToOtherImage(`#img${newIndex}`, "carouselId");
      return newIndex;
    });
  }, 5000);

  return () => clearInterval(intervalId);
}, [queryRandomProduct, currentIndex]); 

  if (queryLatestProduct.isLoading && queryRandomProduct.isLoading) {
    return (
      <>
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          <div className="h-[800px] w-full space-y-2 lg:w-1/2">
            <div className="h-[49%] rounded-2xl bg-primary p-4 text-6xl font-extrabold lg:p-8">
              {title}
            </div>
            <div className="flex h-1/2 space-x-2">
              <Link
                prefetch={false}
                href={"/explore?filter=latest"}
                className="group relative flex h-full w-full items-center justify-center rounded-2xl bg-primary text-5xl font-bold"
              >
                <div className="absolute text-sm italic text-white lg:text-3xl"></div>
              </Link>
              <div className="flex w-1/2 flex-col space-y-2">
                <Link
                  prefetch={false}
                  href={"/explore?filter=latest"}
                  className="group relative flex h-full w-full items-center justify-center rounded-2xl bg-primary text-2xl font-bold"
                >
                  <div className="absolute text-sm italic text-white lg:text-3xl"></div>
                </Link>
                <Link
                  prefetch={false}
                  href={"/explore"}
                  className="flex h-full w-full items-center justify-center rounded-2xl bg-primary text-xl font-bold transition-all hover:text-4xl lg:text-3xl"
                ></Link>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full lg:h-[800px] lg:w-1/2">
            <div className="h-full w-full rounded-2xl bg-primary"></div>
          </div>
        </div>
        <div className="!my-40 flex justify-center text-center text-3xl font-extrabold lg:text-6xl">
          <div className="w-5/6"></div>
        </div>
      </>
    );
  }

  const latestProduct1 = queryLatestProduct.data?.[0];
  const latestProduct2 = queryLatestProduct.data?.[1];

  return (
    <>
      <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
        <div className="h-[800px] w-full space-y-2 lg:w-1/2">
          <div className="h-[49%] rounded-2xl bg-primary p-4 text-6xl font-extrabold lg:p-8">
            {title}
          </div>
          <div className="flex h-1/2 space-x-2">
            <Link
              href={"/explore?filter=latest"}
              className="group relative flex h-full w-full items-center justify-center rounded-2xl bg-primary text-5xl font-bold"
            >
              <Image
                layout="fill"
                className="rounded-2xl object-cover brightness-50 grayscale transition-all duration-700 ease-in-out group-hover:brightness-100 group-hover:grayscale-0"
                src={latestProduct1?.Variant[0]?.images[0] || ""}
                alt=""
              />
              <div className="absolute text-sm italic text-white lg:text-3xl">
                /NEWEST
              </div>
            </Link>
            <div className="flex w-1/2 flex-col space-y-2">
              <Link
                href={"/explore?filter=latest"}
                className="group relative flex h-full w-full items-center justify-center rounded-2xl bg-primary text-2xl font-bold"
              >
                <Image
                  layout="fill"
                  className="rounded-2xl object-cover brightness-50 grayscale transition-all duration-700 ease-in-out group-hover:brightness-100 group-hover:grayscale-0"
                  src={latestProduct2?.Variant[0]?.images[0] || ""}
                  alt=""
                />
                <div className="absolute text-sm italic text-white lg:text-3xl">
                  /LATEST
                </div>
              </Link>
              <Link
                prefetch={false}
                href={"/explore"}
                className="flex h-full w-full items-center justify-center rounded-2xl bg-primary text-xl font-bold transition-all hover:text-4xl lg:text-3xl"
              >
                See More
              </Link>
            </div>
          </div>
        </div>
        <div
          id="carouselId"
          className="carousel h-[400px] w-full lg:h-[800px] lg:w-1/2"
        >
          {queryRandomProduct.data?.map((product, index) => (
            <div
              id={`img${index}`}
              key={index}
              className="carousel-item relative h-full w-full rounded-2xl bg-primary"
            >
              <Image
                layout="fill"
                src={product.Variant[0].images[0] || ""}
                className="h-full w-full rounded-2xl bg-primary object-cover transition-all ease-in-out group-hover:brightness-50"
                alt={`img${index}`}
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href={`#img${(index - 1 + 4) % 4}`}>❮</a>
                <a href={`#img${(index + 1 + 4) % 4}`}>❯</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="!my-40 flex justify-center text-center text-3xl font-extrabold lg:text-6xl">
        <div className="w-5/6">{about}</div>
      </div>
    </>
  );
};

export default Hero;
