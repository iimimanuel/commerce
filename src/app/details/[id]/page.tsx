import Navbar from "@/app/(components)/navbar";
import SimmilarProduct from "./simmilarSeciton";
import Details from "./details";



export default function Page() {


  return (
    <main className="flex w-full flex-col items-center justify-center">
      <div className="w-[80vw] lg:w-[1300px]">
        <Navbar />
      </div>
      <div className="w-[80vw] lg:w-[1100px]">
        <Details />
      </div>
      <div className="w-[80vw] lg:w-[1300px]">
        <SimmilarProduct />
      </div>
    </main>
  );
}
