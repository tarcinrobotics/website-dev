import React, { useEffect, useState } from "react";
import axios from "axios";

interface ForumPost {
  id: string;
  name: string;
  question: string;
  answer?: string;
  createdAt: string;
}

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState({ name: "", question: "" });

  const fetchPosts = async () => {
    try {
      const res = await axios.get<ForumPost[]>("http://localhost:5000/api/forum");
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleSubmit = async () => {
    if (!newPost.name || !newPost.question) return;

    try {
      const res = await axios.post("http://localhost:5000/api/forum", newPost);
      setNewPost({ name: "", question: "" });
      setPosts([res.data, ...posts]); // Add new post to top
    } catch (err) {
      console.error("Error submitting post", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Community & Forums
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          Ask questions, share ideas, and connect with fellow learners.
        </p>

        {/* New Question Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
            value={newPost.name}
            onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
          />
          <textarea
            placeholder="What's your question or idea?"
            className="w-full px-4 py-2 mb-3 rounded border dark:bg-gray-700 dark:text-white"
            rows={3}
            value={newPost.question}
            onChange={(e) => setNewPost({ ...newPost, question: e.target.value })}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>

        {/* Questions + Admin Answers */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <strong>{post.name}</strong> asked:
              </p>
              <p className="text-gray-800 dark:text-white mb-2">{post.question}</p>

              {post.answer && (
                <div className="bg-blue-50 dark:bg-blue-900/40 p-3 rounded mt-2">
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
                    Admin Answer:
                  </p>
                  <p className="text-gray-700 dark:text-white">{post.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityForum;
