"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   useEffect(() => {
    async function checkSession() {

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        setError(error.message);
        router.push("/login");
      } else if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    }
    checkSession();
  }, [router]);

   async function handleLogout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }

  if (!user && !error) {
    return null;  
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="bg-white border border-stone-300 p-8 w-full max-w-md">
        <h1 className="text-3xl font-light text-stone-900 mb-6">Profile</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {user && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 font-medium text-xl">
                {user.user_metadata.first_name ? user.user_metadata.first_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-medium text-stone-900">{user.user_metadata.first_name}</h2>
                <p className="text-stone-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-stone-900 text-white py-2 px-4 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        )}
        <p className="text-sm mt-6 text-stone-600">
          Back to{" "}
          <Link href="/" className="text-stone-700 cursor-pointer hover:text-stone-900">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}