"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

   useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User is already logged in" , session);
        router.push("/");
      }
      else{
        console.log("User is not logged in");
      }
    }
    checkSession();
  }, [router]);

   interface LoginEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  interface LoginError {
    message: string;
  }

  async function handleLogin(event: LoginEvent) {
    setloading(true)
    event.preventDefault();
    setError(null);  
    const { error }: { error: LoginError | null } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);

    } else {
      router.push("/"); 
    }
    setloading(false)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading post...</p>
      </div>
    );}

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="bg-white border border-stone-300 p-8 w-full max-w-md">
        <h1 className="text-3xl font-light text-stone-900 mb-6">Log In</h1>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-stone-300 text-black p-2 rounded-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-stone-300 p-2 text-black rounded-none"
          />
          <button
            onClick={handleLogin}
            className="bg-stone-900 text-white py-2 px-4 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            Login
          </button>
        </div>
        <div className="flex justify-between items-center ">

        <p className="text-sm mt-4 text-stone-600">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-stone-700 hover:text-stone-900">
            Sign Up
          </a>
        </p>
         <p className="text-sm mt-4 text-fuchsia-500 cursor-pointer" onClick={() => router.push("/")}>
          Back  </p>
        </div>
      </div>
    </div>
  );
}