export interface UserSettings {
  id: string;
  walletAddress: string;
  chainId: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  language: string | null;
  theme: string | null;
  githubProfileLink: string | null;
  xProfileLink: string | null;
  defaultPaymentAddress: string | null;
  selectedPaymentAddress: string | null;
  twoFactorEnabled: boolean;
  notificationPreferences: NotificationPreferences | null;
  privacySettings: PrivacySettings | null;
  projects: Project[];
  repositories: Repository[];
  monetizationSettings: MonetizationSettings | null;
  datasets: Dataset[];
  posts: Post[];
  comments: Comment[];
  sessions: Session[];
  refreshTokens: RefreshToken[];
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
}

export interface PrivacySettings {
  id: string;
  userId: string;
  profileVisibility: string;
  showEmail: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  link: string | null;
  userId: string;
}

export interface Repository {
  id: string;
  name: string;
  link: string;
  userId: string;
}

export interface MonetizationSettings {
  id: string;
  userId: string;
  paymentMethod: string | null;
  subscriptionTier: string | null;
}

export interface Dataset {
  id: string;
  title: string;
  description: string | null;
  fileKey: string | null;
  publicUrl: string | null;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  userWalletAddress: string | null;
  tags: string[];
  isPublic: boolean;
  fileType: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  authorWalletAddress: string;
  comments: Comment[];
  likes: number;
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorWalletAddress: string;
  postId: string;
  likes: number;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: JSON | null;
  isValid: boolean;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}
