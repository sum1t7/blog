"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
 
export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  interface SignUpError {
    message: string;
  }

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error }: { error: SignUpError | null } = await supabase.auth.signUp(
      {
        options: {
          data: {
            first_name: username,
          },
        },
        email,
        password,
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setShowConfirmation(true);
    }

    setLoading(false);
  };

  
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="bg-white border border-stone-300 p-8 w-full max-w-md">
        {showConfirmation ? (
          <div>
            <h1 className="text-3xl font-light text-stone-900 mb-6">
              Check your email for a confirmation link.
            </h1>
            <p className="text-sm mt-4 text-stone-600">
              If you don&apos;t see it, check your spam folder.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-light text-stone-900 mb-6">Sign Up</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-stone-300 text-black p-2 rounded-none"
              />
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
                onClick={handleSignUp}
                className="bg-stone-900 text-white py-2 px-4 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            <p className="text-sm mt-4 text-stone-600">
              Already have an account?{" "}
              <a href="/login" className="text-stone-700 hover:text-stone-900">
                Login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}