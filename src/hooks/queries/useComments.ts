import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'

export function useComments(postId: string) {
  const svc = useHttpRequestService()
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => svc.getCommentsByPostId(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}