import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Eye, Plus, Search, Send as Suspend, UserCheck, UserX } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import api from '../../services/api';
import { PaginatedResponse, Trainer } from '../../types';
import { QUERY_KEYS, TRAINER_STATUSES } from '../../utils/constants';
import { debounce, formatDate, getStatusColor } from '../../utils/helpers';

const TrainersPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [actionModal, setActionModal] = useState<{
        open: boolean;
        trainer?: Trainer;
        action?: 'approve' | 'reject' | 'suspend';
    }>({ open: false });

    const pagination = usePagination();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.TRAINERS, { page: pagination.page, limit: pagination.limit, search, status }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search }),
                ...(status && { status }),
            });
            const response = await api.get(`/trainers?${params.toString()}`);
            return response.data.data as PaginatedResponse<Trainer>;
        },
    });

    const updateTrainerMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.put(`/trainers/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRAINERS] });
            toast.success('Trainer status updated successfully!');
            setActionModal({ open: false });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update trainer');
        },
    });

    const handleSearch = debounce((value: string) => {
        setSearch(value);
        pagination.resetPagination();
    }, 300);

    const handleAction = (trainer: Trainer, action: 'approve' | 'reject' | 'suspend') => {
        setActionModal({ open: true, trainer, action });
    };

    const confirmAction = () => {
        if (actionModal.trainer && actionModal.action) {
            const statusMap = {
                approve: 'approved',
                reject: 'rejected',
                suspend: 'suspended',
            };

            updateTrainerMutation.mutate({
                id: actionModal.trainer.id,
                status: statusMap[actionModal.action],
            });
        }
    };

    const getActionLabel = (action?: string) => {
        switch (action) {
            case 'approve':
                return 'Approve';
            case 'reject':
                return 'Reject';
            case 'suspend':
                return 'Suspend';
            default:
                return 'Update';
        }
    };

    const columns = [
        {
            key: 'name',
            title: 'Name',
            render: (value: string, record: Trainer) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{record.email}</p>
                </div>
            ),
        },
        {
            key: 'specialization',
            title: 'Specialization',
        },
        {
            key: 'status',
            title: 'Status',
            render: (value: string) => <Badge className={getStatusColor(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge>,
        },
        {
            key: 'joinedAt',
            title: 'Joined',
            render: (value: string) => formatDate(value),
        },
        {
            key: 'id',
            title: 'Actions',
            render: (value: string, record: Trainer) => (
                <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAction(record, 'approve')}
                                className="text-green-600 hover:text-green-700"
                            >
                                <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAction(record, 'reject')}
                                className="text-red-600 hover:text-red-700"
                            >
                                <UserX className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    {record.status === 'approved' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(record, 'suspend')}
                            className="text-orange-600 hover:text-orange-700"
                        >
                            <Suspend className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
                    <p className="text-gray-600">Manage trainer registrations and accounts</p>
                </div>
                <div className="flex space-x-3">
                    <Link to="/trainers/requests">
                        <Button variant="outline">View Requests</Button>
                    </Link>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trainer
                    </Button>
                </div>
            </div>

            <Card>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search trainers..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            {TRAINER_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No trainers found" />

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

            <Modal isOpen={actionModal.open} onClose={() => setActionModal({ open: false })} title={`${getActionLabel(actionModal.action)} Trainer`}>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to {actionModal.action} "{actionModal.trainer?.name}"?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setActionModal({ open: false })}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionModal.action === 'reject' || actionModal.action === 'suspend' ? 'danger' : 'primary'}
                            onClick={confirmAction}
                            loading={updateTrainerMutation.isPending}
                        >
                            {getActionLabel(actionModal.action)}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TrainersPage;
