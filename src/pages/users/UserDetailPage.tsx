import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    ArrowLeft, 
    CreditCard, 
    MessageSquare, 
    Calendar, 
    User as UserIcon, 
    Phone, 
    Mail, 
    MapPin, 
    DollarSign, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Send, 
    X,
    PlusCircle
} from 'lucide-react';
import api from '../../services/api';
import { User, GymSetting } from '../../types';
import { QUERY_KEYS, API_BASE_URL } from '../../utils/constants';
import { useUserTransactions, useCreateTransaction } from '../../services/transactionsService';
import toast from 'react-hot-toast';

export const getProfileImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = API_BASE_URL.replace(/\/api$/, "");
    return `${baseUrl}${cleanPath}`;
};

const UserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

    // Re-payment form state
    const [paymentAmount, setPaymentAmount] = useState<number>(500);
    const [durationMonths, setDurationMonths] = useState<number>(1);
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
    const [notes, setNotes] = useState<string>('');

    // Fetch user detail
    const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useQuery({
        queryKey: [QUERY_KEYS.USERS, id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/users/${id}`);
            return response.data.data as User;
        },
        enabled: !!id,
    });

    // Fetch user transactions
    const { data: transactions = [], isLoading: isTransactionsLoading } = useUserTransactions(id || '');

    // Fetch settings for alert templates
    const { data: settings } = useQuery({
        queryKey: [QUERY_KEYS.SETTINGS],
        queryFn: async () => {
            const res = await api.get('/settings');
            return res.data.data as GymSetting;
        },
    });

    const createTransactionMutation = useCreateTransaction();

    // Auto-calculate end date when duration or start date changes
    const calculateEndDate = (startStr: string, months: number) => {
        const start = startStr ? new Date(startStr) : new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + months);
        return end.toISOString().split('T')[0];
    };

    const handleOpenPaymentModal = () => {
        const initialStart = user?.subscriptionExpiresAt 
            ? new Date(user.subscriptionExpiresAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
        
        setStartDate(initialStart);
        setDurationMonths(1);
        setPaymentAmount(user?.paymentAmount || 500);
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setEndDate(calculateEndDate(initialStart, 1));
        setNotes('Membership Fee Renewal');
        setIsPaymentModalOpen(true);
    };

    const handleDurationChange = (months: number) => {
        setDurationMonths(months);
        setEndDate(calculateEndDate(startDate, months));
    };

    const handleStartDateChange = (val: string) => {
        setStartDate(val);
        setEndDate(calculateEndDate(val, durationMonths));
    };

    const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        createTransactionMutation.mutate({
            userId: id,
            amount: paymentAmount,
            paymentDate,
            startDate,
            endDate,
            durationMonths,
            paymentMethod,
            notes,
        }, {
            onSuccess: () => {
                setIsPaymentModalOpen(false);
                refetchUser();
            }
        });
    };

    // Alert Handlers
    const handleSendWhatsApp = async () => {
        if (!user) return;
        try {
            const response = await api.post(`/users/${user.id}/send-alert`, { type: "whatsapp" });
            const data = response.data?.data;

            if (data?.autoSent) {
                toast.success('WhatsApp alert sent automatically in the background!');
                setIsAlertModalOpen(false);
                return;
            }

            const gymName = settings?.gymName || "Our Gym";
            const expiryStr = user.subscriptionExpiresAt 
                ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
                : "N/A";
            
            let messageTemplate = settings?.whatsappTemplate || 
                "Hello {name}, your gym membership {code} status is currently {status}. Please clear your pending fees before {dueDate}.";
            
            messageTemplate = messageTemplate
                .replace(/{name}/g, user.name)
                .replace(/{code}/g, user.membershipCode || '')
                .replace(/{status}/g, user.membershipStatus || 'inactive')
                .replace(/{dueDate}/g, expiryStr)
                .replace(/{gymName}/g, gymName);

            const phoneClean = (user.phone || '').replace(/[^0-9]/g, '');
            const encodedMsg = encodeURIComponent(messageTemplate);
            const waUrl = data?.whatsappUrl || (phoneClean
                ? `https://wa.me/${phoneClean}?text=${encodedMsg}`
                : `https://wa.me/?text=${encodedMsg}`);
            
            window.open(waUrl, '_blank');
            toast.success('WhatsApp chat opened!');
            setIsAlertModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to trigger alert');
        }
    };

    const handleSendSMS = async () => {
        if (!user) return;
        try {
            await api.post(`/users/${user.id}/send-alert`, { type: "sms" });
            toast.success('SMS alert simulated and recorded successfully!');
            setIsAlertModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send SMS');
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Member not found.</p>
                <button
                    onClick={() => navigate('/users')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                    Back to Members List
                </button>
            </div>
        );
    }

    const isExpired = user.membershipStatus === 'expired' || 
        (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date());

    return (
        <div className="space-y-6 text-left">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/users')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Members
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAlertModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Send Reminder
                    </button>

                    <button
                        onClick={handleOpenPaymentModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        <CreditCard className="h-4 w-4" />
                        Record Re-payment
                    </button>
                </div>
            </div>

            {/* Member Profile Banner Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div 
                            onClick={() => user.profileImage && setIsImageLightboxOpen(true)}
                            className={`h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0 relative group ${user.profileImage ? 'cursor-pointer' : ''}`}
                            title={user.profileImage ? "Click to view full image" : "No photo uploaded"}
                        >
                            {user.profileImage ? (
                                <>
                                    <img
                                        src={getProfileImageUrl(user.profileImage) || user.profileImage}
                                        alt={user.name}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                        <span>View</span>
                                    </div>
                                </>
                            ) : (
                                <UserIcon className="h-10 w-10 text-blue-600" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                {user.membershipCode && (
                                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                                        {user.membershipCode}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                                {user.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5" />
                                        {user.phone}
                                    </span>
                                )}
                                {user.email && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        {user.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-semibold uppercase">Membership Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                user.membershipStatus === 'active' && !isExpired
                                    ? 'bg-green-100 text-green-800'
                                    : isExpired
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                <span className={`h-2 w-2 rounded-full ${
                                    user.membershipStatus === 'active' && !isExpired
                                        ? 'bg-green-500'
                                        : isExpired
                                        ? 'bg-red-500'
                                        : 'bg-yellow-500'
                                }`} />
                                {isExpired ? 'Expired' : user.membershipStatus?.toUpperCase() || 'INACTIVE'}
                            </span>
                        </div>

                        <div className="text-right border-l pl-4">
                            <p className="text-xs text-gray-400 font-semibold uppercase">Fee Status</p>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                user.feesPaid
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                            }`}>
                                {user.feesPaid ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                        Paid
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                        Pending
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Member Quick Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Member Since</p>
                        <p className="text-sm font-bold text-gray-900">
                            {user.membershipStartDate 
                                ? new Date(user.membershipStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Subscription Expiry</p>
                        <p className={`text-sm font-bold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                            {user.subscriptionExpiresAt 
                                ? new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Last Payment Amount</p>
                        <p className="text-sm font-bold text-gray-900">
                            ₹{user.paymentAmount || 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-gray-400 font-semibold uppercase">Home Address</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                            {user.address || 'Not Provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Member Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Payment & Transaction History</h2>
                        <p className="text-xs text-gray-500">All historical renewals and payments recorded for this member</p>
                    </div>

                    <button
                        onClick={handleOpenPaymentModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add New Payment
                    </button>
                </div>

                {isTransactionsLoading ? (
                    <div className="py-8 text-center text-gray-400 text-sm">Loading transaction history...</div>
                ) : transactions.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">No payment transactions recorded yet</p>
                        <button
                            onClick={handleOpenPaymentModal}
                            className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
                        >
                            + Record First Payment
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Duration</th>
                                    <th className="py-3 px-4">Validity Period</th>
                                    <th className="py-3 px-4">Method</th>
                                    <th className="py-3 px-4">Notes</th>
                                    <th className="py-3 px-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-gray-900">
                                            {tx.paymentDate 
                                                ? new Date(tx.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-green-700">
                                            ₹{tx.amount}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-gray-700">
                                            {tx.durationMonths || 1} Month(s)
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-gray-500 font-medium">
                                            {tx.startDate ? new Date(tx.startDate).toLocaleDateString() : 'N/A'} - {tx.endDate ? new Date(tx.endDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                {tx.paymentMethod || 'Offline'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs truncate">
                                            {tx.notes || tx.description || 'Membership Payment'}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Re-payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Record Re-payment</h3>
                                <p className="text-xs text-gray-500">Renew membership for {user.name}</p>
                            </div>
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4">
                            {/* Duration Quick Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                                    Subscription Duration
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 3, 6, 12].map((months) => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => handleDurationChange(months)}
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                                durationMonths === months
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            +{months} Mo{months > 1 ? 's' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount & Method */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Payment Amount (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm font-semibold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI / GPay / Paytm</option>
                                        <option value="Card">Credit/Debit Card</option>
                                        <option value="Offline">Offline Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => handleStartDateChange(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        New Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm font-semibold text-blue-700 bg-blue-50/50"
                                    />
                                </div>
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Date of Payment Received
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 border p-2 text-sm text-gray-900"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Notes / Description
                                </label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g. Monthly fee paid in cash"
                                    className="w-full rounded-lg border-gray-300 border p-2 text-sm text-gray-900"
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTransactionMutation.isPending}
                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {createTransactionMutation.isPending ? 'Saving...' : 'Confirm & Renew Membership'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alert Options Modal */}
            {isAlertModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100 relative text-left">
                        <button
                            onClick={() => setIsAlertModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-900">Send Membership Reminder</h2>
                        <p className="text-sm text-gray-500">
                            Choose how to alert <span className="font-semibold text-gray-800">{user.name}</span>. Both options are free.
                        </p>

                        <div className="border border-green-200 bg-green-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                                <MessageSquare className="h-5 w-5" />
                                <span>WhatsApp Message (Free Direct Link)</span>
                            </div>
                            <p className="text-xs text-green-700">
                                Opens WhatsApp directly with pre-filled fee alert message.
                            </p>
                            <button
                                onClick={handleSendWhatsApp}
                                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Send className="h-4 w-4" />
                                Send via WhatsApp
                            </button>
                        </div>

                        <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                                <Phone className="h-5 w-5" />
                                <span>SMS Notification (Free Gateway Simulation)</span>
                            </div>
                            <p className="text-xs text-blue-700">
                                Simulates instant free SMS delivery to member's mobile number.
                            </p>
                            <button
                                onClick={handleSendSMS}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Send className="h-4 w-4" />
                                Send Free SMS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full-Screen Profile Image Lightbox Modal */}
            {isImageLightboxOpen && user.profileImage && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
                    <div className="relative max-w-3xl w-full flex flex-col items-center justify-center text-center space-y-3">
                        <button
                            onClick={() => setIsImageLightboxOpen(false)}
                            className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            title="Close full-screen image view"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-h-[80vh] flex items-center justify-center">
                            <img
                                src={getProfileImageUrl(user.profileImage) || user.profileImage}
                                alt={user.name}
                                className="max-h-[75vh] w-auto object-contain rounded-2xl"
                            />
                        </div>

                        <div className="text-white space-y-0.5">
                            <p className="text-lg font-bold">{user.name}</p>
                            {user.membershipCode && (
                                <span className="font-mono text-xs text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
                                    {user.membershipCode}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailPage;
