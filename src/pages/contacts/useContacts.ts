import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchContacts,
    markAsRead,
    createContact,
} from "../../services/contactsService";
import { QUERY_KEYS } from "../../utils/constants";

interface ContactQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const useContacts = (params: ContactQueryParams = {}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.CONTACTS, params],
        queryFn: () =>
            fetchContacts(
                params.page || 1,
                params.limit || 10,
                params.search || "",
            ),
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.CONTACT_STATS],
            });
        },
    });
};

export const useCreateContact = () => {
    return useMutation({
        mutationFn: createContact,
    });
};
