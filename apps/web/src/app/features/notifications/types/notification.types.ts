// ===== SHARED TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BulkResponse<T> {
  success: boolean;
  data: {
    created?: T[];
    updated?: T[];
    deleted?: string[];
    errors?: any[];
  };
  message?: string;
}

// ===== NOTIFICATION TYPES =====

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  action_url?: string;
  read?: boolean;
  read_at?: string;
  archived?: boolean;
  archived_at?: string;
  priority?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationRequest {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  action_url?: string;
  read?: boolean;
  read_at?: string;
  archived?: boolean;
  archived_at?: string;
  priority?: string;
  expires_at?: string;
}

export interface UpdateNotificationRequest {
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
  action_url?: string;
  read?: boolean;
  read_at?: string;
  archived?: boolean;
  archived_at?: string;
  priority?: string;
  expires_at?: string;
}

export interface ListNotificationQuery {
  page?: number;
  limit?: number;
  search?: string;
  id?: string;
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
  action_url?: string;
  read?: boolean;
  read_at?: string;
  archived?: boolean;
  archived_at?: string;
  priority?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Legacy alias for backwards compatibility
export type ListNotificationParams = ListNotificationQuery;