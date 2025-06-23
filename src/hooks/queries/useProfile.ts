import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'

export function useProfile(id: string) {
  const svc = useHttpRequestService()

  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => svc.getProfile(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}