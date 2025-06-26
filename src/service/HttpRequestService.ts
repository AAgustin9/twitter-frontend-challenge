import type { PostData, SingInData, SingUpData } from "./index";
import axios from "axios";
import axiosClient from "./AxiosClient";
import { User } from "./index";
import { S3Service } from "./S3Service";

const url =
  process.env.REACT_APP_API_URL || "https://twitter-ieea.onrender.com/api";

const getImageUrl = (key: string) =>
     `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`

const httpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
    const res = await axiosClient.post("/auth/signup", data);
    if (res.status === 201) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  signIn: async (data: SingInData) => {
    const res = await axiosClient.post("/auth/login", data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  createPost: async (data: PostData) => {
    const res = await axiosClient.post("/post", data);
    if (res.status === 201) {
      return res.data;
    }
  },
  getPostImageUploadUrl: async (contentType: string): Promise<{ uploadUrl: string; imageUrl: string; key: string }> => {
    const res = await axiosClient.post("post/image/upload-url", { contentType });
    if (res.status !== 200) {
      throw new Error(`Failed to fetch presigned URL (status ${res.status})`);
    }
    return res.data as { uploadUrl: string; imageUrl: string; key: string };
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    const res = await axiosClient.get(`post/${query}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPosts: async (query: string) => {
    const res = await axiosClient.get(`/post/${query}`);
    if (res.status !== 200) throw new Error("fetch failed");
    // so that each key becomes an url
    return res.data.map((post: any) => ({
      ...post,
      images: post.images.map(
        (key: string) =>
          `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`
      ),
    }));
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await axiosClient.get("/user", {
      params: {
        limit,
        skip,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  me: async () => {
    const res = await axiosClient.get("/user/me");
    if (res.status === 200) {
      return res.data;
    }
  },
  getPostById: async (id: string) => {
    const res = await axiosClient.get(`/post/${id}`);
    if (res.status === 200) {
      const post = res.data
      return {
        ...post,
        images: post.images.map(getImageUrl)
      }
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    const res = await axiosClient.post(
      `reaction/${postId}`,
      { type: reaction },
    );
    if (res.status === 201) {
      return res.data;
    }
  },
  deleteReaction: async (reactionId: string) => {
    const res = await axiosClient.delete(`/reaction/${reactionId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  followUser: async (userId: string) => {
    const res = await axiosClient.post(
      `/follower/follow/${userId}`, {});
    if (res.status === 201) {
      return res.data;
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await axiosClient.delete(`/follower/unfollow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getFollowing: async () => {
    const res = await axiosClient.get('follower/following')
    if (res.status !== 200) throw new Error('Fetch failed')
    return res.data as User[]
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axiosClient.get("/user/search", {
        params: {
          username,
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await axiosClient.get(`/user/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await axiosClient.get(`/post/by_user/${id}`, {
      params: {
        limit,
        after,
      },
    });

    if (res.status === 200) {
      return (res.data as any[]).map((post) => ({
        ...post,
        images: post.images.map(getImageUrl),
      }))
    }
  },
  getPostsFromProfile: async (id: string) => {
    const res = await axiosClient.get(`/post/by_user/${id}`);
    if (res.status === 200) {
      return (res.data as any[]).map((post) => ({
        ...post,
        images: post.images.map(getImageUrl),
      }));
    }
  },

  isLogged: async () => {
    const res = await axiosClient.get("/user/me");
    return res.status === 200;
  },

  getProfileView: async (id: string) => {
    const res = await axiosClient.get(`/user/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await axiosClient.delete("/user/me");
    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  },

  getChats: async () => {
    const res = await axiosClient.get("/chat");

    if (res.status === 200) {
      return res.data;
    }
  },

  getMutualFollows: async () => {
    const res = await axiosClient.get("/follow/mutual");

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (id: string) => {
    const res = await axiosClient.post("/chat", { users: [id] });

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await axiosClient.get(`/chat/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await axiosClient.delete(`/post/${id}`);
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await axiosClient.get(`/comment/${id}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getCommentsByPostId: async (id: string) => {
    const res = await axiosClient.get(`/comment/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
};

const useHttpRequestService = () => httpRequestService;

class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
