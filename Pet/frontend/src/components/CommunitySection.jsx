import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareHeart, Heart, MessageCircle, Share2, Sparkles, Send, PlusCircle, X, Image as ImageIcon } from 'lucide-react';
import { mockPosts, mockPetProfiles } from '../data/mockData';

export default function CommunitySection() {
  const [posts, setPosts] = useState(mockPosts);
  const [activeTag, setActiveTag] = useState('all');
  const [commentInputs, setCommentInputs] = useState({});
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Recovery Journey');
  const [newPetName, setNewPetName] = useState(mockPetProfiles[0].name);

  const tags = [
    { id: 'all', label: 'All Stories' },
    { id: 'Recovery Journey', label: 'Recovery Journey' },
    { id: 'Diet & Nutrition', label: 'Diet & Nutrition' },
    { id: 'Behavior & Training', label: 'Behavior & Training' },
  ];

  const handleToggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.liked;
          return {
            ...post,
            liked: isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), user: 'Elena V. (You)', text },
            ],
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: 'Elena Vasquez',
      authorRole: 'Pet Parent',
      petName: newPetName,
      petBreed: 'Golden Retriever • 3 yrs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: newTitle,
      content: newContent,
      tag: newTag,
      likes: 1,
      liked: true,
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
      timestamp: 'Just now',
      comments: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const filteredPosts = posts.filter(
    (p) => activeTag === 'all' || p.tag === activeTag
  );

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <MessageSquareHeart className="w-4 h-4" />
            <span>Pet Care Community & Recovery Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn, Share & Celebrate Pet Milestones
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Real pet parents and veterinarians sharing dietary wins, post-surgery milestones, training advice, and healthy habits.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Share Pet Story
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTag(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTag === t.id
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stories Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {filteredPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 overflow-hidden flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              {/* Post Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{post.author}</h4>
                    <p className="text-[11px] text-teal-400">{post.petName} ({post.petBreed})</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{post.timestamp}</span>
              </div>

              {/* Post Media */}
              {post.image && (
                <div className="relative h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md">
                    {post.tag}
                  </span>
                </div>
              )}

              {/* Post Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Interaction Footer & Comments */}
            <div className="p-5 pt-3 border-t border-slate-800/80 bg-slate-950/40">
              {/* Like / Comment / Share counts */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-rose-400 transition-colors group"
                  >
                    <motion.div whileTap={{ scale: 1.4 }}>
                      <Heart
                        className={`w-4 h-4 ${
                          post.liked
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-400 group-hover:text-rose-400'
                        }`}
                      />
                    </motion.div>
                    <span className="font-semibold">{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MessageCircle className="w-4 h-4 text-teal-400" />
                    <span className="font-semibold">{post.comments.length}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert("Story link copied to clipboard!")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comments List */}
              {post.comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/60 max-h-36 overflow-y-auto pr-1">
                  {post.comments.map((c) => (
                    <div key={c.id} className="text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      <span className="font-bold text-teal-300">{c.user}: </span>
                      <span className="text-slate-300">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment input */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Encourage with a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-white transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Share New Story Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0f1722] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <button
                onClick={() => setShowNewPostModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">Share Pet Story or Milestone</h3>
              <p className="text-xs text-slate-400 mb-6">
                Inspire pet parents facing similar health journeys or showcase daily joy!
              </p>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Pet Celebrating
                  </label>
                  <select
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    {mockPetProfiles.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Story Topic
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Recovery Journey">Recovery Journey</option>
                    <option value="Diet & Nutrition">Diet & Nutrition</option>
                    <option value="Behavior & Training">Behavior & Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Post Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 months seizure-free after diet switch!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Story & Tips
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what helped, medication advice from your vet, or lessons learned..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-teal-400" />
                    <span>Pet photo included (preview attached)</span>
                  </div>
                  <span className="text-[10px] text-teal-400 font-semibold">Ready</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all"
                >
                  Publish Story to Community Hub
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
