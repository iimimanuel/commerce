"use client";

import { useState } from "react";
import CategoriesManageMentGrid from "./categoriesTable";



const Users = () => {


  return (
    <main className="flex-1 p-8">
      <h1 className="mb-6 text-3xl font-bold">Categories</h1>

      <div className="overflow-x-auto">
        <CategoriesManageMentGrid />
      </div>
    </main>
  );
};

export default Users;
