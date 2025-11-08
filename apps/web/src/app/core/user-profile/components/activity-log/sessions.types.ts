export interface ActivitySession {
  session_id: string;
  start_time: string;
  end_time?: string;
  ip_address?: string;
  device_info?: {
    browser?: string;
    os?: string;
    device?: string;
    isMobile?: boolean;
    isDesktop?: boolean;
    isTablet?: boolean;
  };
  location_info?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  activities_count: number;
  is_active: boolean;
}

export interface SessionPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SessionsResponse {
  sessions: ActivitySession[];
  pagination: SessionPagination;
}

export interface SessionStats {
  total_sessions: number;
  active_sessions: number;
  unique_devices: number;
  unique_locations: number;
  last_session: string;
}

export interface SessionFilters {
  status?: 'active' | 'inactive';
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
