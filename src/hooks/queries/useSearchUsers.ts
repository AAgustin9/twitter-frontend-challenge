import { useHttpRequestService } from "../../service/HttpRequestService";
import { useQuery } from "@tanstack/react-query";
import { LIMIT } from "../../util/Constants";
import { Author } from "../../service";

interface UseSearchUsersProps {
    query: string;
    skip: number;
  }

export const useSearchUsers = ({ query, skip }: UseSearchUsersProps) => {
const service = useHttpRequestService();

const {
    data = [],
    isLoading,
    isError,
} = useQuery<Author[], Error>({
    queryKey: ['searchUsers', query, skip],
    queryFn: () => service.searchUsers(query, LIMIT, skip),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
});


const uniqueUsers = data
    .filter((user, index, self) => self.findIndex((u) => u.id === user.id) === index)
    .filter((user) => user.username.includes(query));

return {
    users: uniqueUsers,
    loading: isLoading,
    error: isError,
    hasMore: data.length > 0,
};
};