import { useInfiniteQuery } from "@tanstack/react-query";
import { useHttpRequestService } from "../../service/HttpRequestService";

const PAGE_SIZE = 10;
export function useInfiniteFeed(query: string) {
    const service = useHttpRequestService();
    
    return useInfiniteQuery({
        queryKey: ["infinitePosts", query],
        queryFn: ({ pageParam = "" }) => 
            service.getPaginatedPosts(PAGE_SIZE, pageParam, query),
        getNextPageParam: (lastPage) =>
            lastPage.length < PAGE_SIZE
                ? undefined
                : lastPage[lastPage.length - 1].id,
        initialPageParam: "",
    });
}