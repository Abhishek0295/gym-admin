import api from "./api";
import { PaginatedResponse, Contact } from "../types";

export const fetchContacts = async (
    page: number,
    limit: number,
    search: string,
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
    });
    const response = await api.get(`/contacts?${params.toString()}`);
    const rawData = response.data.data;

    return {
        data: rawData.data,
        total: rawData.total,
        page: rawData.page,
        limit: rawData.limit,
        totalPages: rawData.totalPages,
    } as PaginatedResponse<Contact>;
};

export const fetchUnreadCount = async () => {
    const response = await api.get("/contacts/unread-count");
    return response.data.count as number;
};

export const markAsRead = async (id: string) => {
    const response = await api.put(`/contacts/${id}/read`);
    return response.data;
};

export const createContact = async (
    data: Omit<Contact, "id" | "isRead" | "createdAt">,
) => {
    const response = await api.post("/contacts", data);
    return response.data;
};
