import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
export const dynamic = "force-dynamic";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    console.log("User is logged in");
  } else {
    console.log("No user session found");
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, created_at, topics")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading posts: {error.message}
          </p>
          {user ? (
            <Link
              href="/create-post"
              className="px-6 py-2 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              Create First Post
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              Login to Create Post
            </Link>
          )}
        </div>
      </div>
    );
  }

  const topicStyles: Record<string, { bg: string; color: string }> = {
    Tech: { bg: "bg-blue-100", color: "text-blue-800" },
    Life: { bg: "bg-green-100", color: "text-green-800" },
    Philosophy: { bg: "bg-yellow-100", color: "text-yellow-800" },
    Gaming: { bg: "bg-purple-100", color: "text-purple-800" },
    Music: { bg: "bg-red-100", color: "text-red-800" },
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex formainheading space-x-6 items-center justify-between mb-6">
            <div>
              <h1 className=" text-8xl forheading font-bold text-stone-900 mb-2">
                <span
                  style={{
                    WebkitTextStroke: "2px #222",
                    color: "transparent",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                  className="mr-2"
                >
                  Recent{" "}
                </span>
                Posts{" "}
                <span className="-ml-6 lg:text-xl md:text-xl hover:text-6xl  cursor-none forseal" >
                  🦭
                </span>
              </h1>
            </div>
            <div>
              {user ? (
                <Link href="/profile" className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-3xl text-stone-700 font-light">
                    {user.user_metadata.first_name
                      ? user.user_metadata.first_name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-white lg:block md:block sm:block  hidden text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white border border-stone-300 rounded-none p-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-light text-stone-900 mb-3">
                  No posts yet
                </h2>
                <p className="text-stone-600 mb-6">
                  Start your journey by creating your first post and sharing
                  your thoughts with the community.
                </p>
                {user ? (
                  <Link
                    href="/create-post"
                    className="inline-block px-8 py-3 bg-stone-900 text-white font-medium rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                    Create Your First Post
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-block px-8 py-3 bg-stone-900 text-white font-medium rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                    Login to Create Post
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
              >
                <Link href={`/post/${post.id}`} className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-extralight text-stone-900 group-hover:text-stone-700 transition-colors leading-relaxed flex-1 mr-4">
                      {post.title}
                    </h2>
                    <svg
                      className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 -z-2 pointer-events-none overflow-hidden hidden rounded-lg group-hover:block">
                    <div className="relative w-full h-full flex backdrop-blur-lg  ">
                      <Image
                        src="/blob.svg"
                        className="blobs blob1 opacity-50 z-0 absolute"
                        alt="Blob"
                        width={128}
                        height={128}
                      />
                      <Image
                        src="/blob1.svg"
                        className="blobs blob2 opacity-50 z-0 absolute"
                        alt="Blob"
                        width={128}
                        height={128}
                      />
                      <Image
                        src="/blob2.svg"
                        className="blobs blob3 opacity-50 z-0 absolute"
                        alt="Blob"
                        width={128}
                        height={128}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-stone-500">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>

                    {post.topics && post.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-4">
                        {post.topics.slice(0, 3).map((topic: string) => {
                          const style = topicStyles[topic] || {
                            bg: "bg-stone-100",
                            color: "text-stone-800",
                          };
                          return (
                            <span
                              key={topic}
                              className={`px-2 py-1 text-xs font-medium border border-current ${style.bg} ${style.color}`}
                            >
                              {topic}
                            </span>
                          );
                        })}
                        {post.topics.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-600 border border-stone-300">
                            +{post.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {posts && posts.length > 0 && user ? (
          <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
            <Link
              href="/create-post"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Post
            </Link>
          </footer>
        ) : (
          <footer className="mt-16 pt-8 border-t flex justify-center items-center space-x-3 border-stone-200 text-center">
            <p className="text-stone-600">
              Wanna <span className="text-fuchsia-500"> spread your </span>{" "}
              thoughts?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              Login
            </Link>
            <p className="text-stone-600">to create a post</p>
          </footer>
        )}
      </div>
    </div>
  );
}
