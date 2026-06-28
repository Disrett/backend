'use client';

import { X, ArrowLeft, Heart, MessageCircle, Bookmark } from 'lucide-react';

export default function PostModal({ 
  post, 
  onClose, 
  onLike, 
  onSave, 
  comments, 
  newComment, 
  setNewComment, 
  onAddComment 
}) {
  if (!post) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 lg:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-[#0047AB] to-[#FFA75F]">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold hidden sm:inline">Retour</span>
          </button>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row max-h-[calc(95vh-60px)] lg:max-h-[calc(90vh-80px)]">
          <div className="lg:w-1/2 bg-black flex items-center justify-center max-h-[40vh] lg:max-h-full">
            {post.image && (
              <img 
                src={post.image} 
                alt="Post"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          
          <div className="lg:w-1/2 flex flex-col max-h-[55vh] lg:max-h-full">
            <div className="p-3 lg:p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src={post.authorImage} 
                  alt={post.author}
                  className="w-10 lg:w-12 h-10 lg:h-12 rounded-full ring-2 ring-[#0047AB]"
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
              <p className="text-gray-800 mt-2 lg:mt-3 text-sm lg:text-base">{post.content}</p>
            </div>
            
            <div className="px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4 lg:gap-6">
                <button 
                  onClick={() => onLike(post.id)}
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
            <div className="flex items-center gap-2">
              <MessageCircle size={24} className="lg:w-[28px] lg:h-[28px] text-gray-600" strokeWidth={2.5} />
              <span className="text-gray-800 font-bold text-sm lg:text-base">{post.comments}</span>
            </div>
          </div>
          
          <button 
            onClick={() => onSave(post.id)}
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
        
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
          <h3 className="font-bold text-[#0047AB] text-base lg:text-lg mb-2 lg:mb-3">Commentaires</h3>
          {comments[post.id]?.map(comment => (
            <div key={comment.id} className="flex gap-2 lg:gap-3">
              <img 
                src={comment.authorImage} 
                alt={comment.author}
                className="w-8 lg:w-10 h-8 lg:h-10 rounded-full ring-2 ring-gray-200"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 lg:px-4 py-2">
                  <p className="font-semibold text-[#0047AB] text-xs lg:text-sm">{comment.author}</p>
                  <p className="text-gray-800 text-sm lg:text-base">{comment.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-3 lg:ml-4">{comment.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 lg:p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2 lg:gap-3">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
              alt="Vous"
              className="w-8 lg:w-10 h-8 lg:h-10 rounded-full ring-2 ring-[#0047AB]"
            />
            <input 
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddComment(post.id);
                }
              }}
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-3 lg:px-4 py-2 border-2 border-[#0047AB]/30 rounded-full focus:outline-none focus:border-[#0047AB] bg-white text-sm lg:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}