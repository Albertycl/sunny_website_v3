
import React from 'react';
import { SocialPost } from '../types';

interface SocialFeedProps {
  posts: SocialPost[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group"
        >
          <div className="relative aspect-video">
            {post.thumbnail ? (
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="absolute top-3 right-3">
              {post.platform === 'youtube' && <span className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold">YouTube</span>}
              {post.platform === 'facebook' && <span className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold">Facebook</span>}
            </div>
          </div>
          <div className="p-4">
            <div className="text-[10px] text-gray-400 font-medium mb-1">{post.date}</div>
            <h4 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-amber-500">{post.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.content}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default SocialFeed;
