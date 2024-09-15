import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './loginForm';
export const metadata: Metadata = {
  title: 'Login'
};

export default function page() {

  return (
    <main className="flex h-screen items-center justify-center ">
          <LoginForm />
          {/* <Link href="/login" className="text-slate-300 hover:underline">
            Login
          </Link> */}
    </main>
  );
}
