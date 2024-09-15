"use client";

import { useState } from "react";
import ProductsTable from "./productsTable";
import VariantManagementGrid from "./variantTable";

const Products = () => {

  return (
    <main className="flex-1 p-8 space-y-2">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      {/* Products Content */}
      <div className=" space-y-4 overflow-x-auto">
        <ProductsTable />
      </div>
      <div className=" space-y-4 overflow-x-auto">
        <VariantManagementGrid />
      </div>
    </main>
  );
};

export default Products;
