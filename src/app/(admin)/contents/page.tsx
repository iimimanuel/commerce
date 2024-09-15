"use client";

import { useState } from "react";
import ContentManagementGrid from "./contentTables";



const Users = () => {


  return (
    <main className="flex-1 p-8">
      <h1 className="mb-6 text-3xl font-bold">Contents</h1>

      <div className="overflow-x-auto">
        <ContentManagementGrid />
      </div>
    </main>
  );
};

export default Users;
