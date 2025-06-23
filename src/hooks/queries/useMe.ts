import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'

export function useMe() {
  const svc = useHttpRequestService()
  
  return useQuery({
    queryKey: ['me'],
    queryFn: () => svc.me(),
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 5,
  })
}