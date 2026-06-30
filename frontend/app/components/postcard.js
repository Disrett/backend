'use client';

import { Heart, MessageCircle, Bookmark } from 'lucide-react';

export default function PostCard({ post, onLike, onSave, onOpenModal }) {
  return (
    <div className="bg-white border-2 border-gray-100 mb-4 lg:mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div 
        className="flex items-center p-3 lg:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onOpenModal(post)}
      >
        <img 
          src={post.authorImage} 
          alt={post.author}
          className="w-10 lg:w-12 h-10 lg:h-12 rounded-full mr-3 ring-2 ring-[#0047AB]"
        />
        <div className="flex-1">
          <h3 className="font-bold text-[#0047AB] text-sm lg:text-base">{post.author}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs lg:text-sm text-gray-500">{post.timeAgo}</p>
            <span className="text-xs bg-[#0047AB]/10 text-[#0047AB] px-2 py-0.5 lg:py-1 rounded-full font-semibold">
              {post.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 lg:p-4 cursor-pointer" onClick={() => onOpenModal(post)}>
        <p className="text-gray-800 mb-3 lg:mb-4 text-base lg:text-lg">{post.content}</p>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post"
            className="w-full rounded-xl object-cover max-h-80 lg:max-h-96 shadow-md"
          />
        )}
      </div>

      <div className="px-3 lg:px-4 py-2 lg:py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className="flex items-center gap-2 hover:scale-110 transition-transform"
          >
            <Heart 
              size={24} 
              className="lg:w-[28px] lg:h-[28px]"
              fill={post.isLiked ? "currentColor" : "none"}
              className={post.isLiked ? "text-[#FFA75F]" : "text-gray-600"}
              strokeWidth={2.5}
            />
            <span className="text-gray-800 font-bold text-sm lg:text-base">{post.likes}</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(post);
            }}
            className="flex items-center gap-2 hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} className="lg:w-[28px] lg:h-[28px] text-gray-600" strokeWidth={2.5} />
            <span className="text-gray-800 font-bold text-sm lg:text-base">{post.comments}</span>
          </button>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSave(post.id);
          }}
          className="hover:scale-110 transition-transform"
        >
          <Bookmark 
            size={24}
            className="lg:w-[28px] lg:h-[28px]"
            fill={post.isSaved ? "currentColor" : "none"}
            className={post.isSaved ? "text-[#0047AB]" : "text-gray-600"}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}