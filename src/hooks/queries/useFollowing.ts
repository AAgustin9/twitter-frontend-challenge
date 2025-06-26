import { useQuery } from '@tanstack/react-query'
import { useHttpRequestService } from '../../service/HttpRequestService'
import type { User } from '../../service'

export const useGetFollowing = () => {
  const svc = useHttpRequestService()

  return useQuery<User[], Error>({
    queryKey: ['following'],
    queryFn: () => svc.getFollowing(),
  })
}
