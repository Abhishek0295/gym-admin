import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Send,
    Phone,
    MapPin,
    Mail,
    Filter,
    Calendar,
    DollarSign,
    UserCheck,
    MessageSquare,
    X,
    Eye,
    User as UserIcon,
} from "lucide-react";
import {
    useUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useSendAlert,
} from "../../services/usersService";
import { User } from "../../types";
import { API_BASE_URL } from "../../utils/constants";

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    // Search and filter states
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [feesPaid, setFeesPaid] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch members
    const { data: paginatedData, isLoading } = useUsers({
        page,
        limit,
        search,
        status,
        feesPaid,
    });

    // Mutations
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const sendAlertMutation = useSendAlert();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form validation schema with Yup
    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Full Name is required"),
        email: Yup.string().trim().email("Invalid email format").nullable(),
        phone: Yup.string().trim().nullable(),
        address: Yup.string().trim().nullable(),
        membershipStatus: Yup.string().oneOf(["active", "expired", "inactive"]).required(),
        feesPaid: Yup.boolean(),
        membershipStartDate: Yup.string().nullable(),
        subscriptionExpiresAt: Yup.string().nullable(),
        paymentDate: Yup.string().nullable(),
        paymentAmount: Yup.number().min(0, "Amount cannot be negative"),
    });

    // Formik Form state & handler
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            membershipStatus: "inactive" as "active" | "expired" | "inactive",
            feesPaid: false,
            subscriptionExpiresAt: "",
            membershipStartDate: "",
            paymentDate: "",
            paymentAmount: 0,
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                ...values,
                profileImage: profileImageBase64 || undefined,
            };

            if (selectedUser) {
                updateUserMutation.mutate(
                    { id: selectedUser.id, data: payload },
                    {
                        onSuccess: () => setIsModalOpen(false),
                    }
                );
            } else {
                createUserMutation.mutate(payload, {
                    onSuccess: () => setIsModalOpen(false),
                });
            }
        },
    });

    const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);

    // Alert details popup state
    const [alertUser, setAlertUser] = useState<User | null>(null);
    const [alertDetails, setAlertDetails] = useState<{
        whatsappUrl: string;
        whatsappMessage?: string;
        smsMessage: string;
        phone: string;
    } | null>(null);

    // Helper to calculate expiry date based on start date and month duration
    const handleQuickExpiry = (months: number) => {
        const baseDateStr = formik.values.membershipStartDate || new Date().toISOString().split("T")[0];
        const baseDate = new Date(baseDateStr);
        baseDate.setMonth(baseDate.getMonth() + months);
        
        formik.setFieldValue("membershipStartDate", formik.values.membershipStartDate || baseDateStr);
        formik.setFieldValue("subscriptionExpiresAt", baseDate.toISOString().split("T")[0]);
    };

    // Handle search input change (reset to page 1)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    // Handle filter select changes (reset to page 1)
    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleFeesFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFeesPaid(e.target.value);
        setPage(1);
    };

    // Open Modal for Add
    const handleAddClick = () => {
        setSelectedUser(null);
        formik.resetForm({
            values: {
                name: "",
                email: "",
                phone: "",
                address: "",
                membershipStatus: "inactive",
                feesPaid: false,
                subscriptionExpiresAt: "",
                membershipStartDate: "",
                paymentDate: "",
                paymentAmount: 0,
            }
        });
        setProfileImageBase64(null);
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        formik.resetForm({
            values: {
                name: user.name,
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                membershipStatus: user.membershipStatus || "inactive",
                feesPaid: user.feesPaid || false,
                subscriptionExpiresAt: user.subscriptionExpiresAt
                    ? new Date(user.subscriptionExpiresAt).toISOString().split("T")[0]
                    : "",
                membershipStartDate: user.membershipStartDate
                    ? new Date(user.membershipStartDate).toISOString().split("T")[0]
                    : "",
                paymentDate: user.paymentDate
                    ? new Date(user.paymentDate).toISOString().split("T")[0]
                    : "",
                paymentAmount: user.paymentAmount || 0,
            }
        });
        setProfileImageBase64(user.profileImage || null);
        setIsModalOpen(true);
    };

    const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ open: boolean; userId?: string; userName?: string }>({ open: false });

    // Handle Delete
    const handleDeleteClick = (user: User) => {
        setDeleteConfirmModal({ open: true, userId: user.id, userName: user.name });
    };

    // Handle Profile Image Selection (Convert & Compress to Lightweight JPEG)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
                        setProfileImageBase64(compressedBase64);
                    } else {
                        setProfileImageBase64(reader.result as string);
                    }
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger WhatsApp/SMS alert creation from settings template
    const handleAlertClick = (user: User) => {
        sendAlertMutation.mutate(user.id, {
            onSuccess: (data) => {
                setAlertUser(user);
                setAlertDetails(data);
            },
        });
    };

    // Helper to format image path
    const getProfileImageUrl = (imagePath?: string) => {
        if (!imagePath) return null;
        if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return imagePath;
        }
        // Base API URL is e.g. http://localhost:4000/api
        // We strip /api to get http://localhost:4000
        const serverOrigin = API_BASE_URL.replace("/api", "");
        return `${serverOrigin}${imagePath}`;
    };

    const members = paginatedData?.data || [];
    const totalPages = paginatedData?.totalPages || 1;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gym Members</h1>
                    <p className="text-gray-500 text-sm">
                        Manage gym memberships, statuses, payment records, and alert users.
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-1.5" />
                    Add New Member
                </button>
            </div>

            {/* Filters panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search box */}
                    <div className="relative md:col-span-6">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Membership Code, Name, Phone..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                        />
                    </div>
                    {/* Status filter */}
                    <div className="relative md:col-span-3">
                        <select
                            value={status}
                            onChange={handleStatusFilterChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2 bg-white"
                        >
                            <option value="">All Membership Statuses</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    {/* Fees filter */}
                    <div className="relative md:col-span-3">
                        <select
                            value={feesPaid}
                            onChange={handleFeesFilterChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2 bg-white"
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="true">Fees Paid</option>
                            <option value="false">Fees Unpaid / Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Members List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : members.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12 text-center">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No members found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try modifying your filters or search keywords.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop View Table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Member Info
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Membership Code
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Offline Payment
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Membership Dates
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.map((member) => {
                                    const imgUrl = getProfileImageUrl(member.profileImage);
                                    return (
                                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div 
                                                    onClick={() => navigate(`/users/${member.id}`)}
                                                    className="flex items-center cursor-pointer group"
                                                    title="Click to view member landing page"
                                                >
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        {imgUrl ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover border group-hover:border-blue-500 transition-colors"
                                                                src={imgUrl}
                                                                alt={member.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold border group-hover:bg-blue-200 transition-colors">
                                                                {member.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {member.name}
                                                        </div>
                                                        {member.phone && (
                                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <Phone className="h-3 w-3" />
                                                                {member.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm bg-gray-100 px-2.5 py-1 rounded text-gray-700 font-medium">
                                                    {member.membershipCode || "Generating..."}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                                        member.membershipStatus === "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : member.membershipStatus === "expired"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {member.membershipStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-max ${
                                                            member.feesPaid
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {member.feesPaid ? "Paid" : "Pending"}
                                                    </span>
                                                    {member.feesPaid && member.paymentAmount !== undefined && (
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            ₹{member.paymentAmount} {member.paymentDate ? `on ${new Date(member.paymentDate).toLocaleDateString()}` : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex flex-col text-xs space-y-0.5">
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Start:</span>{" "}
                                                        {member.membershipStartDate
                                                            ? new Date(member.membershipStartDate).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Expires:</span>{" "}
                                                        {member.subscriptionExpiresAt
                                                            ? new Date(member.subscriptionExpiresAt).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/users/${member.id}`)}
                                                        className="text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                                        title="View Member Landing Page"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAlertClick(member)}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors"
                                                        title="Send Notification Alert"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(member)}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                                                        title="Edit Member"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(member)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Delete Member"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View Grid Card List */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {members.map((member) => {
                            const imgUrl = getProfileImageUrl(member.profileImage);
                            return (
                                <div
                                    key={member.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
                                >
                                    <div 
                                        onClick={() => navigate(`/users/${member.id}`)}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        title="Click to view member landing page"
                                    >
                                        <div className="h-12 w-12 flex-shrink-0">
                                            {imgUrl ? (
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover border group-hover:border-blue-500 transition-colors"
                                                    src={imgUrl}
                                                    alt={member.name}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border group-hover:bg-blue-200 transition-colors">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                {member.name}
                                            </h3>
                                            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                                                {member.membershipCode || "Generating..."}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                                                    member.membershipStatus === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : member.membershipStatus === "expired"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {member.membershipStatus}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    member.feesPaid
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {member.feesPaid ? "Paid" : "Pending"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Block */}
                                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        {member.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}
                                        {member.email && (
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                        )}
                                        {member.address && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="truncate">{member.address}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                            <span>
                                                Start:{" "}
                                                {member.membershipStartDate
                                                    ? new Date(member.membershipStartDate).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                            <span>
                                                Expires:{" "}
                                                {member.subscriptionExpiresAt
                                                    ? new Date(member.subscriptionExpiresAt).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        {member.feesPaid && (
                                            <div className="flex items-center gap-1.5 font-medium text-green-700 bg-green-100/50 px-2 py-0.5 rounded-md mt-1 w-max">
                                                <DollarSign className="h-3.5 w-3.5" />
                                                <span>
                                                    Paid: ₹{member.paymentAmount || 0}
                                                    {member.paymentDate ? ` on ${new Date(member.paymentDate).toLocaleDateString()}` : ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action row */}
                                    <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                                        <button
                                            onClick={() => navigate(`/users/${member.id}`)}
                                            className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleAlertClick(member)}
                                            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            <Send className="h-3.5 w-3.5" />
                                            Alert
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(member)}
                                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(member)}
                                            className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded disabled:opacity-50 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 font-medium">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded disabled:opacity-50 text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Add / Edit Member Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="bg-white rounded-xl max-w-md w-full shadow-xl border border-gray-100 relative flex flex-col max-h-[85vh] mt-10 mb-auto md:my-auto text-left"
                    >
                        {/* Modal Header (Fixed) */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-lg font-bold text-gray-900">
                                {selectedUser ? "Edit Member" : "Add Gym Member"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-5 overflow-y-auto space-y-4 flex-1">
                            {/* Profile Image Input */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase">
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                                        {profileImageBase64 ? (
                                            <img
                                                src={getProfileImageUrl(profileImageBase64) || profileImageBase64}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="h-8 w-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            PNG, JPG up to 2MB (Saved to server disk)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    placeholder="Amit Sharma"
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.name}</p>
                                ) : null}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Email Address (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    placeholder="amit@example.com"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.email}</p>
                                ) : null}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    placeholder="+919876543210"
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.phone}</p>
                                ) : null}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Home Address (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    placeholder="123 Main St, New Delhi"
                                />
                                {formik.touched.address && formik.errors.address ? (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.address}</p>
                                ) : null}
                            </div>

                            {/* Status and Fees */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Membership Status
                                    </label>
                                    <select
                                        name="membershipStatus"
                                        value={formik.values.membershipStatus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2 bg-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Fees Status
                                    </label>
                                    <select
                                        name="feesPaid"
                                        value={formik.values.feesPaid.toString()}
                                        onChange={(e) => {
                                            const isPaid = e.target.value === "true";
                                            formik.setFieldValue("feesPaid", isPaid);
                                            if (isPaid) {
                                                if (!formik.values.paymentDate) {
                                                    formik.setFieldValue("paymentDate", new Date().toISOString().split("T")[0]);
                                                }
                                                if (!formik.values.paymentAmount) {
                                                    formik.setFieldValue("paymentAmount", 500);
                                                }
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2 bg-white"
                                    >
                                        <option value="true">Paid</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Membership Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Membership Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="membershipStartDate"
                                        value={formik.values.membershipStartDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    />
                                    {formik.touched.membershipStartDate && formik.errors.membershipStartDate ? (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.membershipStartDate}</p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Membership Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        name="subscriptionExpiresAt"
                                        value={formik.values.subscriptionExpiresAt}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 border p-2"
                                    />
                                    {formik.touched.subscriptionExpiresAt && formik.errors.subscriptionExpiresAt ? (
                                        <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.subscriptionExpiresAt}</p>
                                    ) : null}
                                </div>
                            </div>

                            {/* Quick Expiry Calculator Buttons */}
                            <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">
                                    Quick Expiry Calculator (Adds to Start Date)
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickExpiry(1)}
                                        className="flex-1 py-1 text-xs border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors font-medium"
                                    >
                                        +1 Month
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickExpiry(3)}
                                        className="flex-1 py-1 text-xs border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors font-medium"
                                    >
                                        +3 Months
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickExpiry(6)}
                                        className="flex-1 py-1 text-xs border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors font-medium"
                                    >
                                        +6 Months
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickExpiry(12)}
                                        className="flex-1 py-1 text-xs border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors font-medium"
                                    >
                                        +12 Months
                                    </button>
                                </div>
                            </div>

                            {/* Payment details */}
                            {formik.values.feesPaid && (
                                <div className="grid grid-cols-2 gap-4 bg-green-50/50 p-3 rounded-lg border border-green-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-green-800 uppercase mb-1">
                                            Payment Date
                                        </label>
                                        <input
                                            type="date"
                                            name="paymentDate"
                                            value={formik.values.paymentDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-10 border p-2 bg-white"
                                        />
                                        {formik.touched.paymentDate && formik.errors.paymentDate ? (
                                            <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.paymentDate}</p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-green-800 uppercase mb-1">
                                            Payment Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="paymentAmount"
                                            value={formik.values.paymentAmount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm h-10 border p-2 bg-white"
                                            placeholder="500"
                                        />
                                        {formik.touched.paymentAmount && formik.errors.paymentAmount ? (
                                            <p className="text-red-500 text-xs mt-1 font-semibold">{formik.errors.paymentAmount}</p>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Fixed) */}
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-gray-50 rounded-b-xl">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    createUserMutation.isPending ||
                                    updateUserMutation.isPending
                                }
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {selectedUser ? "Save Changes" : "Create Member"}
                            </button>
                        </div>
                    </form>
                </div>,
                document.body
            )}

            {/* Alert Option Dialog Modal */}
            {alertUser && alertDetails && createPortal(
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100 relative">
                        <button
                            onClick={() => {
                                setAlertUser(null);
                                setAlertDetails(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-900">Send Membership Alert</h2>
                        <p className="text-sm text-gray-500">
                            Choose how you would like to alert <span className="font-semibold text-gray-800">{alertUser.name}</span>. Both options are completely free.
                        </p>

                        {/* WhatsApp section */}
                        <div className="border border-green-200 bg-green-50 p-4 rounded-xl space-y-2 text-left">
                            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                                <MessageSquare className="h-5 w-5" />
                                <span>WhatsApp Message (Free Link)</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                Will open WhatsApp chat with pre-filled message:
                            </p>
                            <div className="bg-white border border-green-100 p-2.5 rounded text-xs text-gray-700 italic">
                                {alertDetails.whatsappMessage}
                            </div>
                            {alertDetails.whatsappUrl ? (
                                <a
                                    href={alertDetails.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        setAlertUser(null);
                                        setAlertDetails(null);
                                    }}
                                    className="inline-flex justify-center items-center w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 rounded-lg transition-colors text-center"
                                >
                                    Open WhatsApp Chat
                                </a>
                            ) : (
                                <p className="text-xs text-red-500 font-medium">
                                    No phone number provided for this member.
                                </p>
                            )}
                        </div>

                        {/* Native SMS section */}
                        <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl space-y-2 text-left">
                            <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                                <Send className="h-5 w-5" />
                                <span>Standard SMS (Native Mobile App)</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                Will trigger native SMS client with body:
                            </p>
                            <div className="bg-white border border-blue-100 p-2.5 rounded text-xs text-gray-700 italic">
                                {alertDetails.smsMessage}
                            </div>
                            {alertDetails.phone ? (
                                <a
                                    href={`sms:${alertDetails.phone.replace(/[^0-9+]/g, "")}?body=${encodeURIComponent(alertDetails.smsMessage)}`}
                                    onClick={() => {
                                        setAlertUser(null);
                                        setAlertDetails(null);
                                    }}
                                    className="inline-flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors text-center"
                                >
                                    Send via Mobile SMS
                                </a>
                            ) : (
                                <p className="text-xs text-red-500 font-medium">
                                    No phone number provided for this member.
                                </p>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmModal.open && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-gray-100 text-left">
                        <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                            <Trash2 className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">Delete Gym Member</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteConfirmModal.userName}</span>? This will soft delete their profile while keeping payment records safe.
                            </p>
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteConfirmModal({ open: false })}
                                className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteConfirmModal.userId) {
                                        deleteUserMutation.mutate(deleteConfirmModal.userId, {
                                            onSuccess: () => setDeleteConfirmModal({ open: false }),
                                        });
                                    }
                                }}
                                disabled={deleteUserMutation.isPending}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                                {deleteUserMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
