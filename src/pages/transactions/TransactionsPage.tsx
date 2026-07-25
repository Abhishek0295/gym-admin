import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Filter, 
    DollarSign, 
    ArrowDownLeft, 
    Eye, 
    Calendar, 
    PlusCircle, 
    CreditCard, 
    X,
    UserCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Card from '../../components/ui/Card';
import { useTransactions, useCreateTransaction } from '../../services/transactionsService';
import { useUsers } from '../../services/usersService';
import { User } from '../../types';

const TransactionsPage: React.FC = () => {
    const navigate = useNavigate();

    // Filters state
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Modal state for recording repayment
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [paymentAmount, setPaymentAmount] = useState<number>(500);
    const [durationMonths, setDurationMonths] = useState<number>(1);
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [txStartDate, setTxStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [txEndDate, setTxEndDate] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
    const [notes, setNotes] = useState<string>('Membership Fee Payment');

    // Fetch members for selector dropdown in record modal
    const { data: usersData } = useUsers({ limit: 100 });
    const members = usersData?.data || [];

    // Fetch transactions with filters
    const { data: txData, isLoading } = useTransactions({
        page,
        limit: 10,
        search,
        status,
        startDate,
        endDate,
    });

    const transactions = txData?.data || [];
    const totalTransactions = txData?.total || 0;
    const totalPages = txData?.totalPages || 1;
    const totalRevenue = txData?.totalRevenue || 0;

    const createTransactionMutation = useCreateTransaction();

    // Quick date filters
    const handleQuickDateFilter = (type: 'today' | 'month' | 'all') => {
        const today = new Date().toISOString().split('T')[0];
        if (type === 'today') {
            setStartDate(today);
            setEndDate(today);
        } else if (type === 'month') {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            setStartDate(firstDay);
            setEndDate(today);
        } else {
            setStartDate('');
            setEndDate('');
        }
        setPage(1);
    };

    const calculateEndDate = (startStr: string, months: number) => {
        const start = startStr ? new Date(startStr) : new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + months);
        return end.toISOString().split('T')[0];
    };

    const handleOpenRecordModal = () => {
        if (members.length > 0 && !selectedUserId) {
            setSelectedUserId(members[0].id);
        }
        const todayStr = new Date().toISOString().split('T')[0];
        setTxStartDate(todayStr);
        setDurationMonths(1);
        setPaymentDate(todayStr);
        setTxEndDate(calculateEndDate(todayStr, 1));
        setIsRecordModalOpen(true);
    };

    const handleUserSelectInModal = (userId: string) => {
        setSelectedUserId(userId);
        const userObj = members.find((m) => m.id === userId);
        if (userObj) {
            setPaymentAmount(userObj.paymentAmount || 500);
            const initialStart = userObj.subscriptionExpiresAt
                ? new Date(userObj.subscriptionExpiresAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            setTxStartDate(initialStart);
            setTxEndDate(calculateEndDate(initialStart, durationMonths));
        }
    };

    const handleDurationChange = (months: number) => {
        setDurationMonths(months);
        setTxEndDate(calculateEndDate(txStartDate, months));
    };

    const handleRecordPaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;

        createTransactionMutation.mutate(
            {
                userId: selectedUserId,
                amount: paymentAmount,
                paymentDate,
                startDate: txStartDate,
                endDate: txEndDate,
                durationMonths,
                paymentMethod,
                notes,
            },
            {
                onSuccess: () => {
                    setIsRecordModalOpen(false);
                },
            }
        );
    };

    return (
        <div className="space-y-6 text-left">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions & Payment Ledger</h1>
                    <p className="text-sm text-gray-500">Track, filter, and record member fee payments and renewals</p>
                </div>

                <button
                    onClick={handleOpenRecordModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex-shrink-0"
                >
                    <PlusCircle className="h-4 w-4" />
                    Record New Payment
                </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-green-50 text-green-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase">Filtered Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                            <ArrowDownLeft className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase">Avg. Payment / Transaction</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter & Search Bar */}
            <Card className="p-5">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Member Search input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter by Member Name, Code or Notes..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Payment Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>

                            {/* Quick Date Presets */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => handleQuickDateFilter('today')}
                                    className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-white rounded-lg transition-colors"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => handleQuickDateFilter('month')}
                                    className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-white rounded-lg transition-colors"
                                >
                                    This Month
                                </button>
                                <button
                                    onClick={() => handleQuickDateFilter('all')}
                                    className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-white rounded-lg transition-colors"
                                >
                                    All Time
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Date Range Inputs */}
                    <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>Date Filter Range:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-medium">From:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-medium">To:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800"
                            />
                        </div>
                        {(startDate || endDate || search || status) && (
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setSearch('');
                                    setStatus('');
                                    setPage(1);
                                }}
                                className="text-xs font-semibold text-red-600 hover:underline ml-auto"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Transactions Data Table */}
            <Card className="overflow-hidden p-0">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-base font-semibold text-gray-700">No transactions match the selected filters</p>
                        <p className="text-xs text-gray-400 mt-1">Try resetting search parameters or record a new member payment.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase">
                                        <th className="py-3.5 px-4">Member Name & Code</th>
                                        <th className="py-3.5 px-4">Payment Date</th>
                                        <th className="py-3.5 px-4">Amount (₹)</th>
                                        <th className="py-3.5 px-4">Membership Period</th>
                                        <th className="py-3.5 px-4">Method</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Notes</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div 
                                                    onClick={() => tx.userId && navigate(`/users/${tx.userId}`)}
                                                    className="cursor-pointer group"
                                                >
                                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {tx.userName}
                                                    </p>
                                                    {tx.userCode && (
                                                        <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                            {tx.userCode}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-700 font-medium">
                                                {tx.paymentDate
                                                    ? new Date(tx.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-green-700">
                                                ₹{tx.amount}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">
                                                {tx.startDate ? new Date(tx.startDate).toLocaleDateString() : 'N/A'} - {tx.endDate ? new Date(tx.endDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                                    {tx.paymentMethod || 'Offline'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                    Completed
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs truncate">
                                                {tx.notes || tx.description || 'Membership Payment'}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => tx.userId && navigate(`/users/${tx.userId}`)}
                                                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Member Landing Page"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-gray-200"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-medium text-gray-500">
                                    Page {page} of {totalPages} ({totalTransactions} transactions)
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-gray-200"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Record Payment Global Modal */}
            {isRecordModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Record Member Payment</h3>
                                <p className="text-xs text-gray-500">Process fee re-payment & extend subscription</p>
                            </div>
                            <button
                                onClick={() => setIsRecordModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4">
                            {/* Member Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Select Member *
                                </label>
                                <select
                                    required
                                    value={selectedUserId}
                                    onChange={(e) => handleUserSelectInModal(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 border p-2 text-sm bg-white font-medium text-gray-900 focus:ring-blue-500"
                                >
                                    {members.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.membershipCode || 'GYM-XXX'}) - {m.membershipStatus}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration Buttons */}
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
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm font-semibold text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm bg-white text-gray-900"
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
                                        value={txStartDate}
                                        onChange={(e) => {
                                            setTxStartDate(e.target.value);
                                            setTxEndDate(calculateEndDate(e.target.value, durationMonths));
                                        }}
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
                                        value={txEndDate}
                                        onChange={(e) => setTxEndDate(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border p-2 text-sm font-semibold text-blue-700 bg-blue-50/50"
                                    />
                                </div>
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Date Payment Received
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
                                    onClick={() => setIsRecordModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTransactionMutation.isPending}
                                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {createTransactionMutation.isPending ? 'Saving...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;