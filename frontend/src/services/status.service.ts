import { api, BASE_URL } from '@/lib/api';

export interface StatusView {
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  viewedAt: Date;
}

export interface Status {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  font?: string;
  views: StatusView[];
  createdAt: Date;
  expiresAt: Date;
}

export interface GroupedStatus {
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  statuses: Status[];
}

class StatusService {
  /**
   * Create a new status
   */
  async createStatus(data: {
    content: string;
    type: 'text' | 'image' | 'video';
    mediaUrl?: string;
    backgroundColor?: string;
    textColor?: string;
    font?: string;
  }): Promise<Status> {
    const response = await api.post('/status', data);
    return response.data.data;
  }

  /**
   * Get all statuses from friends
   */
  async getStatuses(): Promise<GroupedStatus[]> {
    const response = await api.get('/status');
    return response.data.data;
  }

  /**
   * Get my statuses
   */
  async getMyStatuses(): Promise<Status[]> {
    const response = await api.get('/status/my');
    return response.data.data;
  }

  /**
   * Get user's statuses
   */
  async getUserStatuses(userId: string): Promise<Status[]> {
    const response = await api.get(`/status/user/${userId}`);
    return response.data.data;
  }

  /**
   * View a status (mark as viewed)
   */
  async viewStatus(statusId: string): Promise<Status> {
    const response = await api.put(`/status/${statusId}/view`);
    return response.data.data;
  }

  /**
   * Delete a status
   */
  async deleteStatus(statusId: string): Promise<void> {
    await api.delete(`/status/${statusId}`);
  }

  /**
   * Upload status media file (image/video)
   */
  async uploadMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/status/upload-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  /**
   * Get media URL
   */
  getMediaUrl(mediaUrl: string): string {
    return `${BASE_URL}${mediaUrl}`;
  }
}

export const statusService = new StatusService();

