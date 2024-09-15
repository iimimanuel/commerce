"use client";

import ProductHome from "./(main components)/productsHome";
import Navbar from "./(components)/navbar";
import Hero from "./(main components)/heroContent";
import Footer from "./(components)/Footer";
import ReactQueryProvider from "./reactQueryProvider";

const HomePage = () => {
  return (
      <ReactQueryProvider>
        <main className="flex w-full flex-col items-center justify-center">
          <div className="w-[80vw] lg:w-[1300px]">
            <Navbar />
            <Hero />
            <div className="my-32 flex flex-col justify-center space-y-4">
              <div className="text-4xl font-bold">Shops</div>

              <hr className="w-full border-neutral" />
              <ProductHome />
            </div>
            <Footer />
          </div>
        </main>
      </ReactQueryProvider>
  );
};

export default HomePage;
