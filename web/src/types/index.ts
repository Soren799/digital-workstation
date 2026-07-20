// 全局类型定义

// 用户角色
export type UserRole = 'admin' | 'friend' | 'visitor';

// 用户 Profile
export interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// 磁贴
export interface Tile {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  link?: string;
  module?: string;
  sort_order: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// 收藏类型
export type BookmarkType = 'link' | 'note' | 'image';

// 收藏
export interface Bookmark {
  id: string;
  user_id: string;
  type: BookmarkType;
  title: string;
  description?: string;
  url?: string;
  content?: string;
  image_url?: string;
  tags: string[];
  category?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// 主题
export type Theme = 'light' | 'dark';
