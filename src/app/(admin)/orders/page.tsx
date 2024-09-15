"use client";

import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <main className="flex-1 p-8">
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>
      <div className="overflow-x-auto">
        
      </div>
    </main>
  );
};

export default Dashboard;
