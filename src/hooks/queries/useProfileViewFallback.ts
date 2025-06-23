import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'

export function useProfileViewFallback(id: string, enabled: boolean) {
  const svc = useHttpRequestService()
  return useQuery({
    queryKey: ['profile-view', id],
    queryFn: () => svc.getProfileView(id),
    enabled,
    retry: false,
  })
}
