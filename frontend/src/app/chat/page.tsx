"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { chatService } from "@/services/chat.service";
import { useChat } from "@/hooks/useChat";
import { socketService } from "@/lib/socket";
import { BASE_URL } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  Image as ImageIcon,
  Mic,
  X,
  Check,
  CheckCheck,
  Settings,
  Archive,
  UserCircle,
  CircleDot,
  LogOut,
  Filter,
  Edit,
  Menu,
  Plus,
  Camera,
  Bell,
  Lock,
  Globe,
  Moon,
  User,
  Mail,
  Calendar,
  MapPin,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  Trash2,
  Reply,
  CornerDownLeft,
  Users,
} from "lucide-react";

// Types
interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file" | "audio" | "video";
  fileUrl?: string;
  replyTo?: {
    id: string;
    text: string;
    sender: "me" | "other";
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  pinned?: boolean;
}

type SidebarTab = "chats" | "calls" | "status" | "archive" | "settings" | "profile";

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use the chat hook
  const {
    chats,
    messages,
    selectedChat: selectedChatData,
    loading,
    error,
    typingUsers,
    sendMessage: sendMessageToChat,
    selectChat: selectChatById,
    startTyping,
    stopTyping,
    createChat,
    searchUsers,
    loadChats,
  } = useChat();

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("chats");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserQuery, setAddUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showChatsSidebar, setShowChatsSidebar] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mounted, setMounted] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const user = authService.getCurrentUser();
      console.log('Initial currentUser:', user);
      return user;
    }
    return null;
  });

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Update currentUser from localStorage after mount
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Show chats sidebar on desktop by default
  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowChatsSidebar(true);
      } else {
        setShowChatsSidebar(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  // Log when currentUser changes
  useEffect(() => {
    console.log('currentUser updated:', currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addUserQuery.trim()) {
        handleSearchUser(addUserQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [addUserQuery]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Maximum height in pixels (about 5 lines)
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (selectedChat) {
      // If there's media selected, upload it first
      if (selectedMedia) {
        await handleSendMediaMessage();
        return;
      }

      // Send text message
      if (message.trim()) {
        const replyToId = replyingToMessage?.id || undefined;
        sendMessageToChat(selectedChat, message, replyToId);
        setMessage("");
        setReplyingToMessage(null);
        setShowEmojiPicker(false);
        
        // Reset textarea height after sending
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        
        // Stop typing indicator
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        stopTyping(selectedChat);
      }
    }
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    setSelectedMedia(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMediaMessage = async () => {
    if (!selectedMedia || !selectedChat) return;

    try {
      setUploadingMedia(true);

      // Upload media file
      const uploadResult = await chatService.uploadMedia(selectedMedia);

      // Send message with media URL
      socketService.sendMessage({
        chatId: selectedChat,
        content: message.trim() || (uploadResult.type === 'image' ? '📷 Image' : '🎥 Video'),
        type: uploadResult.type,
        fileUrl: uploadResult.url,
        replyTo: replyingToMessage?.id,
      });

      // Clear states
      setSelectedMedia(null);
      setMediaPreview(null);
      setMessage("");
      setReplyingToMessage(null);
      setShowEmojiPicker(false);

      // Reset file input
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

    } catch (err: any) {
      console.error('Error sending media message:', err);
      alert(err.response?.data?.message || 'Failed to send media. Please try again.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCancelMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    if (mediaInputRef.current) {
      mediaInputRef.current.value = '';
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedChat) return;

    // Start typing
    startTyping(selectedChat);

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to stop typing after 3 seconds
    const timeout = setTimeout(() => {
      stopTyping(selectedChat);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  // Convert backend chat format to UI format
  const formattedChats = chats.map((chat) => {
    // Find other participant (compare using string IDs)
    const otherParticipant = chat.participants.find(
      (p) => p._id?.toString() !== currentUser?.id?.toString()
    );
    const lastMsg = chat.lastMessage as any;
    
    return {
      id: chat._id,
      name: chat.isGroupChat ? chat.groupName || "Group Chat" : otherParticipant?.username || "Unknown",
      avatar: chat.isGroupChat 
        ? chat.groupName?.substring(0, 2).toUpperCase() || "GC"
        : otherParticipant?.username?.substring(0, 2).toUpperCase() || "??",
      avatarUrl: !chat.isGroupChat ? otherParticipant?.avatar : undefined,
      lastMessage: lastMsg?.content || "No messages yet",
      time: lastMsg?.createdAt ? formatTime(new Date(lastMsg.createdAt)) : "",
      unread: 0, // TODO: Calculate from messages
      online: otherParticipant?.online || false,
      typing: typingUsers.length > 0,
      pinned: false,
    };
  });

  const filteredChats = formattedChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatInfo = formattedChats.find((chat) => chat.id === selectedChat);

  // Convert backend messages to UI format
  const formattedMessages = messages.map((msg) => {
    // Check if message is mine (compare sender ID with current user ID)
    const senderId = (msg.sender as any)?._id?.toString() || (msg.sender as any)?.toString();
    const currentUserId = currentUser?.id?.toString();
    const isMine = senderId === currentUserId;
    
    // Find replyTo message if exists
    let replyToMessage: { id: string; text: string; sender: "me" | "other" } | undefined;
    if (msg.replyTo) {
      const replyToId = typeof msg.replyTo === 'string' 
        ? msg.replyTo 
        : (msg.replyTo as any)?._id?.toString();
      
      const originalMessage = messages.find((m) => m._id === replyToId);
      if (originalMessage) {
        const originalSenderId = (originalMessage.sender as any)?._id?.toString() || (originalMessage.sender as any)?.toString();
        const originalIsMine = originalSenderId === currentUserId;
        
        replyToMessage = {
          id: originalMessage._id,
          text: originalMessage.content,
          sender: originalIsMine ? "me" as const : "other" as const,
        };
      }
    }
    
    return {
      id: msg._id,
      text: msg.content,
      sender: isMine ? "me" as const : "other" as const,
      time: formatTime(new Date(msg.createdAt)),
      status: msg.readBy.length > 1 ? "read" as const : 
              msg.deliveredTo.length > 0 ? "delivered" as const : "sent" as const,
      type: msg.type,
      fileUrl: msg.fileUrl,
      replyTo: replyToMessage,
    };
  });

  // Helper function to detect Arabic text
  function containsArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }

  // Helper function to format time
  function formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString();
  }

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleSearchUser = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const users = await searchUsers(query);
      const formattedResults = users.map((user) => ({
        id: user._id,
        name: user.username,
        avatar: user.username.substring(0, 2).toUpperCase(),
        avatarUrl: user.avatar,
        phone: user.phone,
        username: user.username,
        online: user.online,
      }));
      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchResults([]);
    }
  };

  const handleAddToChats = async (user: any) => {
    try {
      // Create or get chat with this user
      const newChat = await createChat(user.id);
      
      // Select the new chat
      setSelectedChat(newChat._id);
      await selectChatById(newChat._id);
      
      // Close modal
      setShowAddUserModal(false);
      setAddUserQuery("");
      setSearchResults([]);
      
      // On mobile, show chat area
      if (window.innerWidth < 1024) {
        setShowChatsSidebar(false);
      }
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent chat selection
    
    if (!confirm("Are you sure you want to delete this chat? All messages will be deleted.")) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      
      // Call API to delete chat
      await chatService.deleteChat(chatId);
      
      // If the deleted chat was selected, clear selection
      if (selectedChat === chatId) {
        setSelectedChat(null);
      }
      
      // Reload chats
      await loadChats();
      
      setDeletingChatId(null);
    } catch (err) {
      console.error("Error deleting chat:", err);
      setDeletingChatId(null);
      alert("Failed to delete chat. Please try again.");
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      
      console.log('Uploading avatar...');
      
      // Upload avatar
      const response = await authService.uploadAvatar(file);
      
      console.log('Avatar uploaded successfully:', response);
      
      // Update current user state immediately
      const updatedUser = {
        ...response.data.user,
        _id: response.data.user.id,
      };
      
      setCurrentUser(updatedUser);
      
      // Reload chats to get updated avatars from other users
      await loadChats();
      
      // Show success message
      alert('Profile picture updated successfully!');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert(err.response?.data?.message || 'Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const topSidebarItems = [
    { id: "chats" as SidebarTab, icon: MessageSquare, label: "Chats", badge: 5 },
    { id: "calls" as SidebarTab, icon: Phone, label: "Calls" },
    { id: "status" as SidebarTab, icon: CircleDot, label: "Status" },
  ];

  const bottomSidebarItems = [
    { id: "archive" as SidebarTab, icon: Archive, label: "Archive" },
    { id: "settings" as SidebarTab, icon: Settings, label: "Settings" },
    { id: "profile" as SidebarTab, icon: UserCircle, label: "Profile" },
  ];

  return (
    <div className="relative flex h-screen overflow-hidden bg-white">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {(showLeftSidebar || (showChatsSidebar && selectedChat)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowLeftSidebar(false);
              if (selectedChat) setShowChatsSidebar(false);
            }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Navigation Sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-40 flex flex-col border-r border-gray-200 bg-gray-50 shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-56" : "w-16"
        } ${
          showLeftSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-full`}
      >
        {/* Toggle Button */}
        <div className={`flex h-14 items-center border-b border-gray-200 ${isSidebarExpanded ? 'px-4' : 'justify-center'}`}>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-200"
            title={isSidebarExpanded ? "Collapse" : "Expand"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Top Navigation Items */}
        <div className="flex flex-col py-2">
          {topSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex h-11 items-center transition-colors ${
                isSidebarExpanded 
                  ? 'justify-start gap-3 px-4' 
                  : 'justify-center'
              } ${activeTab === item.id ? 'text-green-600' : 'text-gray-600'}`}
              title={!isSidebarExpanded ? item.label : undefined}
            >
              {/* Green Bar Indicator */}
              {activeTab === item.id && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-r-full bg-green-500"
                />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {item.badge && item.badge > 0 && (
                <span
                  className={`h-5 min-w-[20px] shrink-0 rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-5 text-white ${
                    isSidebarExpanded ? 'ml-auto' : 'absolute -right-1 -top-1'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Groups Section */}
        <div className="flex-1 overflow-y-auto border-t border-gray-200 py-2">
          <div className={`px-2 mb-2 ${isSidebarExpanded ? 'px-3' : 'px-1'}`}>
            {isSidebarExpanded && (
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
              >
                Groups
              </motion.h3>
            )}
            <div className={`flex ${isSidebarExpanded ? 'flex-col gap-2' : 'flex-col gap-3 items-center'}`}>
              {[
                { name: "Work Team", initial: "WT", color: "bg-blue-500" },
                { name: "Family", initial: "FA", color: "bg-purple-500" },
                { name: "Friends", initial: "FR", color: "bg-pink-500" },
                { name: "College", initial: "CO", color: "bg-orange-500" },
              ].map((group, index) => (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-gray-200 ${
                    isSidebarExpanded ? 'justify-start' : 'justify-center flex-col'
                  }`}
                  title={!isSidebarExpanded ? group.name : undefined}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${group.color} text-white font-semibold text-sm shadow-sm`}>
                    {group.initial}
                  </div>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-medium text-gray-700 truncate flex-1"
                    >
                      {group.name}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Items */}
        <div className="flex flex-col border-t border-gray-200 py-2">
          {bottomSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex h-11 items-center transition-colors ${
                isSidebarExpanded 
                  ? 'justify-start gap-3 px-4' 
                  : 'justify-center'
              } ${activeTab === item.id ? 'text-green-600' : 'text-gray-600'}`}
              title={!isSidebarExpanded ? item.label : undefined}
            >
              {/* Green Bar Indicator */}
              {activeTab === item.id && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-r-full bg-green-500"
                />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`relative flex h-11 w-full items-center transition-colors text-gray-600 ${
              isSidebarExpanded 
                ? 'justify-start gap-3 px-4' 
                : 'justify-center'
            }`}
            title={!isSidebarExpanded ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarExpanded && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Chats/Profile/Settings Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative inset-0 lg:inset-auto z-40 flex w-full sm:w-96 lg:w-96 flex-col border-r border-gray-200 bg-white h-full transition-transform duration-300 ${
          showChatsSidebar || !selectedChat ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Conditional Content Based on Active Tab */}
        {activeTab === "chats" && (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-3 sm:p-4">
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLeftSidebar(true)}
                    className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5" />
                  </motion.button>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chats</h1>
                </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddUser}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                title="Add new chat"
              >
                <Plus className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <Edit className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <Filter className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-gray-100 py-2 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="border-b border-gray-200 bg-linear-to-br from-gray-50 to-white px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {/* My Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-base font-semibold text-white overflow-hidden border-2 border-green-500 p-0.5">
                  {mounted && currentUser?.avatar ? (
                    <img 
                      src={`${BASE_URL}${currentUser.avatar}`} 
                      alt="My Status" 
                      className="h-full w-full object-cover rounded-full bg-white" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      {mounted && currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : "ME"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-md">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700 truncate max-w-[60px]">My Status</p>
            </motion.div>

            {/* Friends Status */}
            {formattedChats.slice(0, 5).map((chat, index) => (
              <motion.div
                key={`status-${chat.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-base font-semibold text-white overflow-hidden border-2 border-green-500 p-0.5">
                    {(chat as any).avatarUrl ? (
                      <img 
                        src={`${BASE_URL}${(chat as any).avatarUrl}`} 
                        alt={chat.name} 
                        className="h-full w-full object-cover rounded-full bg-white" 
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                        {chat.avatar}
                      </div>
                    )}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-md"></div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-700 truncate max-w-[60px]">{chat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: "#f3f4f6" }}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
              onClick={async () => {
                setSelectedChat(chat.id);
                await selectChatById(chat.id);
                // On mobile, hide chats sidebar when selecting a chat
                if (window.innerWidth < 1024) {
                  setShowChatsSidebar(false);
                }
              }}
              className={`relative cursor-pointer border-b border-gray-100 p-3 sm:p-4 transition-all ${
                selectedChat === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-sm sm:text-base font-semibold text-white overflow-hidden">
                    {(chat as any).avatarUrl ? (
                      <img 
                        src={`${BASE_URL}${(chat as any).avatarUrl}`} 
                        alt={chat.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      chat.avatar
                    )}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {chat.name}
                    </h3>
                    <span className="ml-2 shrink-0 text-xs text-gray-500">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-gray-600">
                      {chat.typing ? (
                        <span className="text-green-600">typing...</span>
                      ) : (
                        chat.lastMessage
                      )}
                    </p>
                    {chat.unread > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <AnimatePresence>
                  {(hoveredChatId === chat.id || deletingChatId === chat.id) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      disabled={deletingChatId === chat.id}
                      className={`rounded-full p-2 transition-colors ${
                        deletingChatId === chat.id
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
            </div>
          </>
        )}

        {/* Profile Content */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            {/* Profile Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLeftSidebar(true)}
                  className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Profile Picture */}
                  <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-4xl font-bold text-white shadow-xl overflow-hidden">
                    {mounted && currentUser?.avatar ? (
                      <img 
                        src={`${BASE_URL}${currentUser.avatar}`} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                        onLoad={() => console.log('Avatar loaded:', currentUser.avatar)}
                        onError={(e) => {
                          console.error('Error loading avatar:', currentUser.avatar);
                          console.error('Full URL:', `${BASE_URL}${currentUser.avatar}`);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      mounted && currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : "??"
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className={`absolute bottom-0 right-0 rounded-full p-3 text-white shadow-lg ${
                      uploadingAvatar 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={uploadingAvatar ? "Uploading..." : "Change profile picture"}
                  >
                    {uploadingAvatar ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
                <h2 className="mb-1 text-2xl font-bold text-gray-900">
                  {mounted && currentUser?.username ? currentUser.username : "Unknown User"}
                </h2>
                <p className="text-sm text-gray-500">@{mounted && currentUser?.username ? currentUser.username : "unknown"}</p>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Personal Information</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {mounted && currentUser?.email ? currentUser.email : "Not provided"}
                          </p>
                        </div>
                      </div>
                      {currentUser?.isEmailVerified && (
                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-600">Verified</span>
                        </div>
                      )}
                    </div>
                    {currentUser?.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">
                              {mounted && currentUser.phone ? currentUser.phone : "Not provided"}
                            </p>
                          </div>
                        </div>
                        {currentUser?.isPhoneVerified && (
                          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                            <Check className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Verified</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Joined</p>
                          <p className="text-sm font-medium text-gray-900">
                            {mounted && currentUser?.createdAt
                              ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {currentUser?.lastLogin && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Last Login</p>
                            <p className="text-sm font-medium text-gray-900">
                              {mounted && currentUser.lastLogin
                                ? new Date(currentUser.lastLogin).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {mounted && currentUser?.bio ? currentUser.bio : "Hey there! I'm using FlowChat."}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 text-sm font-semibold text-green-600 hover:text-green-700"
                  >
                    Edit Bio
                  </motion.button>
                </div>

                {/* Edit Profile Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white shadow-md hover:bg-green-600"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Content */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            {/* Settings Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLeftSidebar(true)}
                  className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                {/* Account Settings */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Account Settings</span>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Privacy</p>
                          <p className="text-xs text-gray-500">Control who can see your info</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Security</p>
                          <p className="text-xs text-gray-500">Password, 2FA, sessions</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* App Settings */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Settings className="h-4 w-4" />
                    <span>App Settings</span>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Notifications</p>
                          <p className="text-xs text-gray-500">Customize your alerts</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Moon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Appearance</p>
                          <p className="text-xs text-gray-500">Theme, colors, wallpaper</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Light</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Language</p>
                          <p className="text-xs text-gray-500">Choose your language</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">English</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Storage & Data */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Archive className="h-4 w-4" />
                    <span>Storage & Data</span>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">Storage Usage</p>
                        <p className="text-xs text-gray-500">324 MB used</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">Network Usage</p>
                        <p className="text-xs text-gray-500">1.2 GB this month</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Help & Support */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Help Center</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Contact Us</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#ffffff" }}
                      className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Terms of Service</p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* App Info */}
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="mb-1 text-sm font-semibold text-gray-900">FlowChat</p>
                  <p className="text-xs text-gray-500">Version 1.0.0</p>
                  <p className="mt-2 text-xs text-gray-400">© 2024 FlowChat. All rights reserved.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Calls Content */}
        {activeTab === "calls" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            {/* Calls Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLeftSidebar(true)}
                  className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Calls</h1>
              </div>
            </div>

            {/* Calls Content */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6 rounded-full bg-gray-100 p-8"
              >
                <Phone className="h-16 w-16 text-gray-400" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Recent Calls</h3>
              <p className="text-center text-sm text-gray-500">
                Your call history will appear here
              </p>
            </div>
          </motion.div>
        )}

        {/* Status Content */}
        {activeTab === "status" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            {/* Status Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLeftSidebar(true)}
                  className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Status</h1>
              </div>
            </div>

            {/* Status Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* My Status */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-500">My Status</h3>
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors"
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-sm font-semibold text-white">
                      JD
                    </div>
                    <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500 text-white">
                      <Plus className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">My Status</p>
                    <p className="text-xs text-gray-500">Tap to add status update</p>
                  </div>
                </motion.button>
              </div>

              {/* Recent Updates */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">Recent Updates</h3>
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mb-4 rounded-full bg-gray-100 p-8"
                  >
                    <CircleDot className="h-12 w-12 text-gray-400" />
                  </motion.div>
                  <p className="text-center text-sm text-gray-500">
                    No recent updates
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Archive Content */}
        {activeTab === "archive" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            {/* Archive Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLeftSidebar(true)}
                  className="lg:hidden rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Archived Chats</h1>
              </div>
            </div>

            {/* Archive Content */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6 rounded-full bg-gray-100 p-8"
              >
                <Archive className="h-16 w-16 text-gray-400" />
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Archived Chats</h3>
              <p className="text-center text-sm text-gray-500">
                Chats you archive will appear here
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className={`relative flex flex-1 flex-col bg-gray-50 ${
        !selectedChat ? "hidden lg:flex" : "flex"
      }`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedChat(null);
                    setShowChatsSidebar(true);
                  }}
                  className="lg:hidden rounded-lg p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-sm font-semibold text-white overflow-hidden">
                    {(selectedChatInfo as any)?.avatarUrl ? (
                      <img 
                        src={`${BASE_URL}${(selectedChatInfo as any).avatarUrl}`} 
                        alt={selectedChatInfo?.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      selectedChatInfo?.avatar
                    )}
                  </div>
                  {selectedChatInfo?.online && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {selectedChatInfo?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedChatInfo?.typing ? (
                      <span className="text-green-600">typing...</span>
                    ) : selectedChatInfo?.online ? (
                      "Online"
                    ) : (
                      "Last seen recently"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden sm:flex rounded-full p-2.5 text-gray-600 transition-colors"
                  title="Call"
                >
                  <Phone className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden sm:flex rounded-full p-2.5 text-gray-600 transition-colors"
                  title="Video Call"
                >
                  <Video className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-full p-2.5 text-gray-600 transition-colors"
                  title="More"
                >
                  <MoreVertical className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 lg:px-6 py-3 sm:py-4"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              <AnimatePresence>
                {formattedMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`mb-2 sm:mb-3 flex min-w-0 relative group ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      dir={containsArabic(msg.text) ? "rtl" : "ltr"}
                      className={`max-w-[90%] sm:max-w-[80%] lg:max-w-[65%] min-w-0 rounded-lg px-3 py-2 shadow-sm relative group/message ${
                        msg.sender === "me"
                          ? "text-gray-900"
                          : "bg-white text-gray-900"
                      }`}
                      style={{ 
                        wordWrap: 'break-word', 
                        overflowWrap: 'break-word',
                        backgroundColor: msg.sender === "me" ? "#dcf8c6" : undefined,
                      }}
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      {/* Reply Button - appears on hover inside message box */}
                      <AnimatePresence>
                        {hoveredMessageId === msg.id && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setReplyingToMessage(msg)}
                            className={`absolute ${
                              msg.sender === "me" ? "left-1 top-1" : "right-1 top-1"
                            } rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-lg hover:bg-white transition-colors z-10 border border-gray-200/50`}
                            title="Reply"
                          >
                            <Reply className="h-3.5 w-3.5 text-gray-600" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                      {/* Reply Preview - shown at the top of the message */}
                      {msg.replyTo && (
                        <div 
                          className={`mb-2 pb-2 border-l-3 rounded ${
                            msg.sender === "me" 
                              ? "border-l-green-600 bg-white/60" 
                              : "border-l-gray-400 bg-gray-50"
                          }`}
                          style={{
                            borderLeftWidth: "3px",
                            paddingLeft: "8px",
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Reply className={`h-3 w-3 ${
                              msg.sender === "me" ? "text-green-700" : "text-gray-500"
                            }`} />
                            <span className={`text-xs font-semibold ${
                              msg.sender === "me" ? "text-green-700" : "text-gray-600"
                            }`}>
                              {msg.replyTo.sender === "me" ? "You" : selectedChatInfo?.name}
                            </span>
                          </div>
                          <p 
                            className={`text-xs truncate ${
                              msg.sender === "me" ? "text-green-800" : "text-gray-600"
                            }`}
                            dir={containsArabic(msg.replyTo.text) ? "rtl" : "ltr"}
                          >
                            {msg.replyTo.text}
                          </p>
                        </div>
                      )}
                      
                      {/* Media Content */}
                      {(msg.type === 'image' || msg.type === 'video') && msg.fileUrl && (
                        <div className="mb-2">
                          {msg.type === 'image' ? (
                            <motion.img
                              whileHover={{ scale: 1.02 }}
                              src={`${BASE_URL}${msg.fileUrl}`}
                              alt="Shared image"
                              className="max-w-full rounded-lg cursor-pointer"
                              style={{ maxHeight: '300px', objectFit: 'cover' }}
                              onClick={() => setLightboxImage(`${BASE_URL}${msg.fileUrl}`)}
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={`${BASE_URL}${msg.fileUrl}`}
                              controls
                              className="max-w-full rounded-lg"
                              style={{ maxHeight: '300px' }}
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Text Content */}
                      {msg.text && (
                        <p className="text-sm break-words whitespace-pre-wrap" dir={containsArabic(msg.text) ? "rtl" : "ltr"} style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{msg.text}</p>
                      )}
                      
                      <div
                        className={`mt-1 flex items-center gap-1 text-xs ${
                          msg.sender === "me" ? "text-gray-600 justify-end" : "text-gray-500 justify-end"
                        }`}
                        dir="ltr"
                      >
                        <span>{msg.time}</span>
                        {msg.sender === "me" && (
                          <>
                            {msg.status === "sent" && <Check className="h-3 w-3" />}
                            {msg.status === "delivered" && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                            {msg.status === "read" && (
                              <CheckCheck className="h-3 w-3 text-blue-400" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="border-t border-gray-200 bg-white px-2 sm:px-3 lg:px-4 py-2 sm:py-3"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <Smile className="h-5 w-5" />
                </motion.button>

                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => mediaInputRef.current?.click()}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                  title="Attach image or video"
                >
                  <Paperclip className="h-5 w-5" />
                </motion.button>

                <div className="relative flex-1">
                  {/* Media Preview */}
                  <AnimatePresence>
                    {selectedMedia && mediaPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2 relative rounded-lg border-2 border-green-500 p-2 bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <div className="relative flex-1">
                            {selectedMedia.type.startsWith('image/') ? (
                              <img
                                src={mediaPreview}
                                alt="Preview"
                                className="max-h-40 rounded-lg object-cover"
                              />
                            ) : (
                              <video
                                src={mediaPreview}
                                className="max-h-40 rounded-lg"
                                controls
                              />
                            )}
                            <div className="mt-1 text-xs text-gray-600">
                              {selectedMedia.name} ({(selectedMedia.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCancelMedia}
                            className="rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                          >
                            <X className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reply Preview */}
                  <AnimatePresence>
                    {replyingToMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2 flex items-start gap-2 rounded-lg border-l-3 px-3 py-2"
                        style={{
                          borderLeftWidth: "3px",
                          borderLeftColor: replyingToMessage.sender === "me" ? "#25d366" : "#075e54",
                          backgroundColor: replyingToMessage.sender === "me" ? "#dcf8c6" : "#ece5dd",
                          paddingLeft: "8px",
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-1">
                            <Reply className="h-3 w-3 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-700">
                              {replyingToMessage.sender === "me" ? "You" : selectedChatInfo?.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 truncate" dir={containsArabic(replyingToMessage.text) ? "rtl" : "ltr"}>
                            {replyingToMessage.text}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setReplyingToMessage(null)}
                          className="rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea
                    ref={textareaRef}
                    value={message}
                    dir={containsArabic(message) ? "rtl" : "ltr"}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                        // Reset textarea height after sending
                        if (textareaRef.current) {
                          textareaRef.current.style.height = 'auto';
                        }
                      }
                    }}
                    placeholder="Type a message"
                    rows={1}
                    className="w-full resize-none rounded-2xl bg-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 overflow-hidden leading-6"
                    style={{ 
                      minHeight: '42px',
                      maxHeight: '120px',
                      lineHeight: '1.5rem',
                    }}
                  />

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-14 left-0 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Emojis
                          </h4>
                          <button
                            onClick={() => setShowEmojiPicker(false)}
                            className="rounded-full p-1 hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {[
                            "😊",
                            "😂",
                            "❤️",
                            "👍",
                            "🎉",
                            "🔥",
                            "✨",
                            "💯",
                            "🚀",
                            "👏",
                            "🙏",
                            "💪",
                            "🤔",
                            "😍",
                            "🥳",
                            "😎",
                          ].map((emoji) => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.3 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setMessage(message + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="rounded p-1 text-xl transition-colors hover:bg-gray-100"
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {message.trim() || selectedMedia ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    disabled={uploadingMedia}
                    className={`rounded-full p-2 sm:p-2.5 text-white shadow-md transition-all ${
                      uploadingMedia 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={uploadingMedia ? "Uploading..." : "Send"}
                  >
                    {uploadingMedia ? (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          // No Chat Selected
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6 rounded-full bg-linear-to-br from-green-400 to-emerald-600 p-8 shadow-xl"
            >
              <MessageSquare className="h-16 w-16 text-white" />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              Welcome to FlowChat
            </h2>
            <p className="text-gray-500">
              Select a chat to start messaging
            </p>
          </motion.div>
        )}
      </div>

      {/* Profile Sidebar (when clicking on more options) */}
      <AnimatePresence>
        {showProfile && selectedChatInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:relative right-0 top-0 z-50 flex h-full w-full sm:w-80 lg:w-96 flex-col border-l border-gray-200 bg-white"
            >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Contact Info</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfile(false)}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-3xl font-bold text-white shadow-lg overflow-hidden">
                  {(selectedChatInfo as any)?.avatarUrl ? (
                    <img 
                      src={`${BASE_URL}${(selectedChatInfo as any).avatarUrl}`} 
                      alt={selectedChatInfo.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    selectedChatInfo.avatar
                  )}
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  {selectedChatInfo.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChatInfo.online ? "Online" : "Offline"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs text-gray-500">Username</p>
                  <p className="text-sm font-medium text-gray-900">
                    @{selectedChatInfo.name}
                  </p>
                </div>
                {selectedChat && selectedChatData?.participants && (
                  <>
                    {selectedChatData.participants
                      .filter((p: any) => p._id !== currentUser?.id)
                      .map((p: any) => (
                        <div key={p._id} className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {p.email}
                          </p>
                        </div>
                      ))}
                  </>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full rounded-lg bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100">
                  Block Contact
                </button>
                <button className="w-full rounded-lg bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100">
                  Delete Chat
                </button>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setShowAddUserModal(false);
              setAddUserQuery("");
              setSearchResults([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Chat</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserQuery("");
                    setSearchResults([]);
                  }}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Search Input */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by phone number or username"
                    value={addUserQuery}
                    onChange={(e) => {
                      setAddUserQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchUser(addUserQuery);
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter phone number (e.g., +1234567890) or username
                </p>
              </div>

              {/* Search Results */}
              {addUserQuery.trim() && (
                <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((user) => (
                        <motion.button
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToChats(user)}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 text-base font-semibold text-white overflow-hidden">
                            {(user as any).avatarUrl ? (
                              <img 
                                src={`${BASE_URL}${(user as any).avatarUrl}`} 
                                alt={user.name} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              user.avatar
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {user.phone || user.username}
                            </p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="rounded-full bg-green-500 p-2 text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Search className="mb-4 h-12 w-12 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        {addUserQuery.trim()
                          ? "No user found"
                          : "Start typing to search"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightboxImage}
              alt="Full size image"
              className="max-h-full max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

