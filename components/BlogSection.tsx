import React, { useState } from 'react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  '行李攻略': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '必買清單': { bg: 'bg-pink-100', text: 'text-pink-700' },
  '美食推薦': { bg: 'bg-orange-100', text: 'text-orange-700' },
  '景點介紹': { bg: 'bg-green-100', text: 'text-green-700' },
  '交通攻略': { bg: 'bg-purple-100', text: 'text-purple-700' },
};

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (posts.length === 0) return null;

  return (
    <section className="mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Sunny 的私房推薦</h2>
        <p className="mt-4 text-xl text-gray-500">旅遊小撇步，讓您的旅程更順利</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const colors = categoryColors[post.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.publishDate).toLocaleDateString('zh-TW')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                <span className="inline-flex items-center text-amber-600 font-bold text-sm mt-4">
                  閱讀更多 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPost.image && (
              <div className="h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[selectedPost.category]?.bg || 'bg-gray-100'} ${categoryColors[selectedPost.category]?.text || 'text-gray-700'}`}>
                  {selectedPost.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(selectedPost.publishDate).toLocaleDateString('zh-TW')}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedPost.title}
              </h2>

              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                  <div>
                    <p className="font-bold text-gray-900">Sunny</p>
                    <p className="text-xs text-gray-400">專業韓國導遊</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
