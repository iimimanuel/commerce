"use client";

import { useState } from "react";
import UserManagementGrid from "./userTable";



const Users = () => {

  
   const [users, setUsers] = useState([
     {
       name: "John Doe",
       username: "johndoe",
       email: "john@example.com",
       role: "ADMIN",
     },
   ]);

   const [newUser, setNewUser] = useState({
     name: "",
     username: "",
     email: "",
     role: "",
   });

   const handleInputChange = (e:any) => {
     const { name, value } = e.target;
     setNewUser((prev) => ({ ...prev, [name]: value }));
   };

   const handleAddUser = (e: any) => {
     e.preventDefault();
     if (newUser.name && newUser.username && newUser.email && newUser.role) {
       setUsers((prevUsers) => [...prevUsers, newUser]);
       setNewUser({ name: "", username: "", email: "", role: "" });
     }
   };

  return (
    <main className="flex-1 p-8">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      <div className="overflow-x-auto">
        <UserManagementGrid />
      </div>
    </main>
  );
};

export default Users;
