import { useQuery } from "@tanstack/react-query";
import { useHttpRequestService } from "../../service/HttpRequestService";

export function useProfilePosts(id: string) {
  const svc = useHttpRequestService();

  return useQuery({
    queryKey: ["profile-posts", id],
    queryFn: () => svc.getPostsFromProfile(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}