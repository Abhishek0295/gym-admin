import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "../../services/contactsService";
import { QUERY_KEYS } from "../../utils/constants";

export const useContactStats = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.CONTACT_STATS],
        queryFn: fetchUnreadCount,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
};
