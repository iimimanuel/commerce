"use client";

import { useForm } from "react-hook-form";
import { loginSchema, loginValue } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { logout } from "./action";

export default function LoginForm() {
 

  return (
   <><button onClick={()=>{
    logout()
   }}></button></>
  );
}
