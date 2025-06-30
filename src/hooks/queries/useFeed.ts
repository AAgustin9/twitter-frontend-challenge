import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'

export function useFeed(query: string) {
  const svc = useHttpRequestService()

  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => svc.getPosts(query),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}