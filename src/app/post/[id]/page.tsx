"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  topics: string[];
};

type PostMetadata = {
  id: string;
  post_id: string;
  views: number;
}; 

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [postMetadata, setPostMetadata] = useState<PostMetadata | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchPostAndUser = async () => {
      setLoading(true);
      
       const [userResponse, postResponse, metadataResponse] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("posts").select("*").eq("id", id).single(),
        supabase.from("post_metadata").select("*").eq("post_id", id).single()
      ]);

      setUser(userResponse.data?.user || null);
      
      if (!postResponse.error) {
        setPost(postResponse.data);
      }

      if (!metadataResponse.error) {
        setPostMetadata(metadataResponse.data);
      }
      
      setLoading(false);
    };

    fetchPostAndUser();
  }, [id]);

  useEffect(() => {
    const updateViewCount = async () => {
      if (!id) return;

      try {
         const { data, error } = await supabase.rpc('increment_post_views', {
          post_id: id
        });

        if (error) {
          console.error("Error updating post views:", error);
          
           const { data: metadata, error: upsertError } = await supabase
            .from("post_metadata")
            .upsert(
              { post_id: id, views: 1 },
              { 
                onConflict: 'post_id',
                ignoreDuplicates: false 
              }
            )
            .select()
            .single();

          if (!upsertError && metadata) {
            setPostMetadata(metadata);
          }
        } else {
           setPostMetadata(prev => prev ? { ...prev, views: data } : { 
            id: '', 
            post_id: id as string, 
            views: data 
          });
        }
      } catch (error) {
        console.error("Error in updateViewCount:", error);
      }
    };

     if (id) {
      updateViewCount();
    }
  }, [id]);

  const topicStyles: Record<string, { bg: string; color: string }> = {
    Tech: { bg: "bg-blue-100", color: "text-blue-800" },
    Life: { bg: "bg-green-100", color: "text-green-800" },
    Philosophy: { bg: "bg-yellow-100", color: "text-yellow-800" },
    Gaming: { bg: "bg-purple-100", color: "text-purple-800" },
    Music: { bg: "bg-red-100", color: "text-red-800" },
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirm) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      alert("Post deleted successfully");
      router.push("/");
    } else {
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Post not found</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.author_id;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <header className="mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 mb-6 leading-tight tracking-tight drop-shadow-sm">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-stone-500">
                Published{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {isAuthor && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/edit-post/${id}`)}
                    className="px-4 py-2 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white font-medium border border-red-600 rounded-none hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

             {post.topics && post.topics.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.topics.map((topic) => {
                    const style = topicStyles[topic] || {
                      bg: "bg-stone-100",
                      color: "text-stone-800",
                    };
                    return (
                      <span
                        key={topic}
                        className={`px-3 py-1 text-sm font-medium border border-current ${style.bg} ${style.color}`}
                      >
                        {topic}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </header>
        </motion.header>

        <motion.main
          className="bg-white border border-stone-300 rounded-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <main className="bg-white border border-stone-300 rounded-none">
            <article className="prose prose-stone prose-lg max-w-none p-5">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-light text-stone-900 mb-4 pb-2 border-b border-stone-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-light text-stone-900 mb-3 mt-8">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-stone-900 mb-2 mt-6">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-stone-300 pl-4 italic text-stone-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded-sm text-sm font-mono">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="block bg-stone-100 text-stone-800 p-4 rounded-none text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-stone-900 underline hover:no-underline transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </main>
        </motion.main>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <footer className="mt-12 pt-8 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-stone-900 text-white font-medium rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                ← Back to All Posts
              </button>

              {isAuthor && (
                <p className="text-xs text-stone-500">
                  <span className="text-fuchsia-500">You</span> are the author
                  of this post
                </p>
              )}

              <p className="text-xs text-stone-500">
                views: {postMetadata?.views || 0}
              </p>
            </div>
          </footer>
        </motion.div>

      </div>
    </div>
  );
}