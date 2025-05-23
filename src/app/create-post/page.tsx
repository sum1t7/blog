"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Session } from "@supabase/supabase-js";
import { sanitizeInput } from "@/utils/sanitize";

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  
const topicStyles: Record<string, { bg: string; color: string }> = {
  Tech: { bg: "bg-blue-100", color: "text-blue-800" },
  Life: { bg: "bg-green-100", color: "text-green-800" },
  Philosophy: { bg: "bg-yellow-100", color: "text-yellow-800" },
  Gaming: { bg: "bg-purple-100", color: "text-purple-800" },
  Music: { bg: "bg-red-100", color: "text-red-800" },
};

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (title.length < 3 || title.length > 100) {
    alert("Title must be between 3 and 100 characters.");
    return;
  }
  if (content.length < 10) {
    alert("Content is too short.");
    return;
  }
  
    if (!user) return;

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        topics,
        author_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Post created!");
      router.push("/");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
         <div className="mb-12">
          <h1 className="text-9xl font-light text-center text-stone-900 mb-2">
            Create
            <span
              style={{
                WebkitTextStroke: "2px #222",
                color: "transparent",
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                display: "inline-block",
                  
              }}
              className="mx-4"
            >
              New
            </span>Post  
          </h1>
          <p className="text-stone-600 text-3xl text-center">
            Share your piece of mind <span className="hover:scale-200 ml-2 cursor-none inline-block transition-transform" >🦭</span>
          </p>
        </div>

        <div className="space-y-8">
           <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter your post title..."
              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-none focus:outline-none focus:border-stone-500 transition-colors text-stone-900 placeholder-stone-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Topics
            </label>
            <div className="bg-white border border-stone-300 rounded-none p-4">
              <div className="flex flex-wrap gap-3">
                {Object.keys(topicStyles).map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      if (topics.includes(topic)) {
                        setTopics(topics.filter(t => t !== topic));
                      } else {
                        setTopics([...topics, topic]);
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium border border-stone-300 rounded-none transition-all duration-200 ${
                      topics.includes(topic)
                        ? `${topicStyles[topic].bg} ${topicStyles[topic].color} border-current`
                        : 'bg-white text-stone-700 hover:bg-stone-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              {topics.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <p className="text-xs text-stone-500 mb-2">Selected topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className={`px-3 py-1 text-xs font-medium border border-current ${topicStyles[topic].bg} ${topicStyles[topic].color}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

           <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Content
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-2">
                <div className="text-xs text-stone-500 relative flex items-center gap-2">
                  <span>Markdown Editor</span>
                  <div className="relative group">
                    <div className="absolute left-0 top-7 z-10 w-60 min-h-20 bg-white border border-stone-300  shadow transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                      <div className="p-4 text-xs text-fuchsia-400 whitespace-pre-line">
                        **Bold Text**{"\n"}
                        *Italic Text*{"\n"}
                        `Inline Code`{"\n"}
                        {"```"}{"\n"}Code Block{"\n"}{"```"}{"\n"}
                        - List item 1{"\n"}
                        - List item 2{"\n"}
                        [Link](https://example.com)
                      </div>
                    </div>
                    <div className="w-4 h-4 border rounded-4xl  border-stone-300 bg-white flex items-center justify-center  cursor-pointer">
                      ?
                    </div>
                  </div>
                </div>
                <textarea
                  placeholder="Write your post content here using **Markdown**"
                  rows={20}
                  className="w-full h-96 px-4 py-3 bg-white border border-stone-300 rounded-none focus:outline-none focus:border-stone-500 transition-colors text-stone-900 placeholder-stone-400 font-mono text-sm resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

               <div className="space-y-2">
                <div className="text-xs text-stone-500">Live Preview</div>
                <div className="w-full h-96 px-4 py-3 bg-white border border-stone-300 rounded-none overflow-auto">
                 <div className="prose prose-stone prose-sm max-w-none">
  {content ? (
    <ReactMarkdown>
      {sanitizeInput(content)}
    </ReactMarkdown>
  ) : (
    <p className="text-stone-400 italic">
      Preview will appear here...
    </p>
  )}
</div>
                </div>
              </div>
            </div>
          </div>

           <div className="flex items-center gap-4 pt-6 border-t border-stone-200">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="px-8 py-3 bg-stone-900 text-white font-medium rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Publish Post
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-white text-stone-900 font-medium border border-stone-300 rounded-none hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
