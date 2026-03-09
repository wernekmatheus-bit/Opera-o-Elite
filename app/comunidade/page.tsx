'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ArrowBigUp, Flag, Plus, User, Shield, X, Send, Search, UserPlus, Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

type Post = {
  id: string;
  user_id: string;
  content: string;
  title: string;
  type: 'relato' | 'pergunta';
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    full_name: string;
    rank: string;
    avatar_url: string | null;
  };
  hasUpvoted?: boolean;
  isFollowing?: boolean;
};

export default function ComunidadePage() {
  const { profile, fetchProfile } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recentes' | 'seguindo'>('recentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postType, setPostType] = useState<'relato' | 'pergunta'>('relato');

  // Comments State
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('pmpr_user_email');
    if (email && !profile) {
      fetchProfile(email);
    }
  }, [profile, fetchProfile]);

  useEffect(() => {
    if (profile) {
      fetchPosts();
    } else {
      // If no profile yet, fetchPosts will be called after profile loads
      // or we can just fetch posts without user-specific data (likes/follows)
      fetchPosts();
    }
  }, [activeTab, profile]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch posts with author info
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name, rank, avatar_url)
        `)
        .order('created_at', { ascending: false });

      const { data: postsData, error: postsError } = await query;
      if (postsError) throw postsError;

      let formattedPosts = postsData || [];

      // 2. If user is logged in, fetch their likes and follows to enrich the data
      if (profile) {
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', profile.id);
          
        const { data: followsData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', profile.id);

        const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);
        const followingIds = new Set(followsData?.map(f => f.following_id) || []);

        formattedPosts = formattedPosts.map(post => ({
          ...post,
          hasUpvoted: likedPostIds.has(post.id),
          isFollowing: followingIds.has(post.user_id)
        }));

        if (activeTab === 'seguindo') {
          formattedPosts = formattedPosts.filter(post => followingIds.has(post.user_id));
        }
      }

      setPosts(formattedPosts as Post[]);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (postId: string, hasUpvoted: boolean | undefined) => {
    if (!profile) return;

    // Optimistic update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasUpvoted: !hasUpvoted,
          likes_count: hasUpvoted ? post.likes_count - 1 : post.likes_count + 1
        };
      }
      return post;
    }));

    try {
      if (hasUpvoted) {
        await supabase.from('likes').delete().match({ post_id: postId, user_id: profile.id });
        // Decrement count in posts table
        await supabase.rpc('decrement_likes', { row_id: postId }); // Note: Requires RPC or trigger, for now we just rely on the client state, but ideally we update the table.
        // Simplification for now: just update the count directly
        const post = posts.find(p => p.id === postId);
        if(post) await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', postId);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: profile.id });
        const post = posts.find(p => p.id === postId);
        if(post) await supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId);
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
      fetchPosts(); // Revert on error
    }
  };

  const handleFollow = async (userIdToFollow: string, isFollowing: boolean | undefined) => {
    if (!profile || profile.id === userIdToFollow) return;

    // Optimistic update
    setPosts(posts.map(post => {
      if (post.user_id === userIdToFollow) {
        return { ...post, isFollowing: !isFollowing };
      }
      return post;
    }));

    try {
      if (isFollowing) {
        await supabase.from('follows').delete().match({ follower_id: profile.id, following_id: userIdToFollow });
      } else {
        await supabase.from('follows').insert({ follower_id: profile.id, following_id: userIdToFollow });
      }
    } catch (error) {
      console.error('Erro ao seguir:', error);
      fetchPosts(); // Revert on error
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setComments([]);
      return;
    }
    
    setExpandedPostId(postId);
    setComments([]);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(full_name, rank, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!newComment.trim() || !profile) return;
    
    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: profile.id,
          content: newComment
        }])
        .select(`
          *,
          author:profiles(full_name, rank, avatar_url)
        `)
        .single();
        
      if (error) throw error;
      
      setComments([...comments, data]);
      setNewComment('');
      
      // Update post comment count
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments_count: (post.comments_count || 0) + 1 };
        }
        return post;
      }));
      
      // Also update in DB
      const post = posts.find(p => p.id === postId);
      if(post) await supabase.from('posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', postId);
      
    } catch (error: any) {
      console.error('Erro ao postar comentário:', error);
      alert(`Erro ao publicar comentário: ${error?.message || JSON.stringify(error)}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !profile) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: profile.id,
            title: newTitle,
            content: newContent,
            type: postType,
            is_anonymous: isAnonymous,
          }
        ])
        .select(`
          *,
          author:profiles(full_name, rank, avatar_url)
        `)
        .single();

      if (error) throw error;

      setPosts([{ ...data, hasUpvoted: false, isFollowing: false } as Post, ...posts]);
      setIsComposeOpen(false);
      setNewTitle('');
      setNewContent('');
      setIsAnonymous(false);
      setPostType('relato');
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      alert(`Erro ao publicar: ${error?.message || JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return post.title?.toLowerCase().includes(query) || post.content?.toLowerCase().includes(query);
    }
    return true;
  });

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-tactical-bg/90 backdrop-blur-md pt-4 pb-4 border-b border-white/5">
        <div className="flex flex-col gap-4 px-4 md:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">Comunidade</h1>
              <p className="text-tactical-gray text-sm">Inteligência e Apoio Mútuo</p>
            </div>
            <button 
              onClick={() => setIsComposeOpen(true)}
              className="flex items-center gap-2 bg-tactical-yellow text-tactical-bg px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider hover:bg-tactical-yellow/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Publicação</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex bg-tactical-panel p-1 rounded-lg border border-white/5 w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('recentes')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'recentes' ? 'bg-white/10 text-white' : 'text-tactical-gray hover:text-white'}`}
              >
                Recentes
              </button>
              <button 
                onClick={() => setActiveTab('seguindo')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'seguindo' ? 'bg-white/10 text-white' : 'text-tactical-gray hover:text-white'}`}
              >
                Seguindo
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tactical-gray" />
              <input 
                type="text" 
                placeholder="Buscar dúvidas ou relatos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-tactical-panel border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-tactical-gray focus:outline-none focus:border-tactical-yellow transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div className="mt-6 space-y-4 px-4 md:px-0 max-w-3xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 text-tactical-yellow animate-spin" />
            <p className="text-tactical-gray font-bold uppercase tracking-widest text-sm">Carregando Inteligência...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-tactical-gray">
            <p>Nenhuma publicação encontrada.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.id} className="bg-tactical-panel rounded-xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {post.is_anonymous ? (
                    <div className="w-10 h-10 rounded-full bg-tactical-bg border border-white/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-tactical-gray" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-tactical-gray/30 flex items-center justify-center overflow-hidden">
                      {post.author?.avatar_url ? (
                        <img src={post.author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-white">{getInitials(post.author?.full_name)}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate flex items-center gap-2">
                      {post.is_anonymous ? 'Recruta Anônimo' : (post.author?.full_name || 'Usuário Desconhecido')}
                      {post.type === 'pergunta' && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest rounded-sm">Pergunta</span>}
                      {post.type === 'relato' && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest rounded-sm">Relato</span>}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-tactical-gray">
                      {!post.is_anonymous && <span>{post.author?.rank || 'Recruta'} •</span>}
                      <span>{getTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </div>

                {!post.is_anonymous && profile?.id !== post.user_id && (
                  <button 
                    onClick={() => handleFollow(post.user_id, post.isFollowing)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${
                      post.isFollowing 
                        ? 'bg-white/10 border-white/10 text-white' 
                        : 'bg-transparent border-tactical-yellow text-tactical-yellow hover:bg-tactical-yellow/10'
                    }`}
                  >
                    {post.isFollowing ? <><Check className="w-3 h-3" /> Seguindo</> : <><UserPlus className="w-3 h-3" /> Seguir</>}
                  </button>
                )}
              </div>

              {/* Post Body */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white mb-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Post Footer (Actions) */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleUpvote(post.id, post.hasUpvoted)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                      post.hasUpvoted 
                        ? 'text-tactical-yellow bg-tactical-yellow/10' 
                        : 'text-tactical-gray hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ArrowBigUp className={`w-5 h-5 ${post.hasUpvoted ? 'fill-tactical-yellow' : ''}`} />
                    <span className="font-bold text-sm">{post.likes_count || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-tactical-gray hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-bold text-sm">{post.comments_count || 0}</span>
                  </button>
                </div>

                <button className="p-2 text-tactical-gray hover:text-tactical-red hover:bg-tactical-red/10 rounded-md transition-colors" title="Denunciar">
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedPostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    <div className="space-y-4 mb-4">
                      {comments.length === 0 ? (
                        <p className="text-sm text-tactical-gray text-center py-2">Nenhum comentário ainda. Seja o primeiro!</p>
                      ) : (
                        comments.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-tactical-gray/30 flex items-center justify-center overflow-hidden shrink-0">
                              {comment.author?.avatar_url ? (
                                <img src={comment.author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold text-white">{getInitials(comment.author?.full_name)}</span>
                              )}
                            </div>
                            <div className="flex-1 bg-tactical-bg/50 rounded-lg p-3 border border-white/5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-white">{comment.author?.full_name || 'Usuário'}</span>
                                <span className="text-[10px] text-tactical-gray">{getTimeAgo(comment.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-300">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="flex-1 bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-tactical-gray focus:outline-none focus:border-tactical-yellow transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment(post.id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="bg-tactical-yellow text-tactical-bg px-4 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
                      >
                        {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposeOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[10%] left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-tactical-panel rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/5 bg-tactical-bg/50">
                <h2 className="text-lg font-bold uppercase tracking-wide">Novo Relato</h2>
                <button onClick={() => setIsComposeOpen(false)} className="p-2 text-tactical-gray hover:text-white rounded-full hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col p-4 overflow-y-auto">
                {/* Post Type Selector */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setPostType('relato')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold uppercase tracking-widest transition-colors ${
                      postType === 'relato' 
                        ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                        : 'bg-tactical-bg border-white/5 text-tactical-gray hover:border-white/20'
                    }`}
                  >
                    Relato / Dica
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('pergunta')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold uppercase tracking-widest transition-colors ${
                      postType === 'pergunta' 
                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                        : 'bg-tactical-bg border-white/5 text-tactical-gray hover:border-white/20'
                    }`}
                  >
                    Pergunta / Dúvida
                  </button>
                </div>

                {/* Author Preview */}
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-tactical-bg/50 border border-white/5">
                  {isAnonymous ? (
                    <div className="w-10 h-10 rounded-full bg-tactical-panel border border-white/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-tactical-gray" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-tactical-gray/30 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-white">{getInitials(profile?.full_name || '')}</span>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">
                      {isAnonymous ? 'Recruta Anônimo' : (profile?.full_name || 'Usuário')}
                    </p>
                    <p className="text-xs text-tactical-gray">
                      {isAnonymous ? 'Sua identidade será ocultada' : (profile?.rank || 'Recruta')}
                    </p>
                  </div>
                  
                  {/* Anonymous Toggle */}
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-tactical-yellow' : 'bg-tactical-gray/30'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAnonymous ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-xs font-bold uppercase text-tactical-gray hidden sm:block">
                      Anônimo
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Título do seu relato ou dúvida..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-transparent border-none text-xl font-bold text-white placeholder:text-tactical-gray/50 focus:outline-none focus:ring-0 mb-4"
                  maxLength={100}
                  required
                />
                
                <textarea
                  placeholder="Descreva os detalhes da sua situação, dúvida ou dica de estudo. A comunidade está aqui para ajudar..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-transparent border-none text-gray-300 placeholder:text-tactical-gray/50 focus:outline-none focus:ring-0 resize-none min-h-[150px]"
                  required
                />

                <div className="flex justify-end pt-4 mt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newContent.trim() || isSubmitting}
                    className="flex items-center gap-2 bg-tactical-yellow text-tactical-bg px-6 py-2.5 rounded-md font-bold uppercase tracking-wider hover:bg-tactical-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
