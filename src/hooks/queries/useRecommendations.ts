import { useQuery } from '@tanstack/react-query';
import { useHttpRequestService } from '../../service/HttpRequestService';
import { Author } from '../../service';

const PAGE_SIZE = 10

export function useRecommendations(page: number) {
  const service = useHttpRequestService();

  return useQuery<Author[], Error>({
    queryKey: ['recommendedUsers', page],
    queryFn: () => service.getRecommendedUsers(PAGE_SIZE, page),
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
};
