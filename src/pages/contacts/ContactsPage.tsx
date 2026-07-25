import { Search, Mail, Phone, Calendar, User } from "lucide-react";
import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Pagination from "../../components/ui/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { usePagination } from "../../hooks/usePagination";
import { useContacts, useMarkAsRead } from "./useContacts";
import { cn } from "../../utils/helpers";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ContactsPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebouncedValue(search, 300);
    const pagination = usePagination();

    const { data, isLoading, refetch } = useContacts({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
    });

    const markAsReadMutation = useMarkAsRead();

    const handleMarkAsRead = (id: string) => {
        markAsReadMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Marked as read");
                refetch();
            },
            onError: () => {
                toast.error("Failed to mark as read");
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Contacts
                    </h1>
                    <p className="text-gray-600">
                        View and manage contact form submissions
                    </p>
                </div>
            </div>

            {/* Search + List */}
            <Card>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                pagination.resetPagination();
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No contacts found
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className={cn(
                                            "hover:bg-gray-50",
                                            !contact.isRead &&
                                                "bg-green-50/100",
                                        )}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {contact.name}
                                                    </div>
                                                    {!contact.isRead && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {contact.email}
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        {contact.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className="text-sm text-gray-900 max-w-xs truncate"
                                                title={contact.message}
                                            >
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(
                                                    contact.createdAt,
                                                ).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!contact.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            contact.id,
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Mark as Read
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={data.totalPages}
                            onPageChange={pagination.goToPage}
                            totalItems={data.total}
                            itemsPerPage={pagination.limit}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ContactsPage;
