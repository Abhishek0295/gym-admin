import React, { useState } from 'react';
import { Plus, Send, Eye, Bell, Mail, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks/usePagination';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Notification, PaginatedResponse } from '../../types';
import { QUERY_KEYS, NOTIFICATION_TYPES } from '../../utils/constants';
import { formatDate, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; notification?: Notification }>({ open: false });
  
  const pagination = usePagination();
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, { page: pagination.page, limit: pagination.limit, type, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(type && { type }),
        ...(status && { status }),
      });
      const response = await api.get(`/notifications?${params.toString()}`);
      return response.data.data as PaginatedResponse<Notification>;
    },
  });

  const resendNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/notifications/${id}/resend`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      toast.success('Notification resent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resend notification');
    },
  });

  const handleView = (notification: Notification) => {
    setViewModal({ open: true, notification });
  };

  const handleResend = (id: string) => {
    resendNotificationMutation.mutate(id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Bell className="h-4 w-4" />;
      case 'publication': return <Mail className="h-4 w-4" />;
      case 'payment': return <AlertTriangle className="h-4 w-4" />;
      case 'riftshards': return <AlertTriangle className="h-4 w-4" />;
      case 'report': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const columns = [
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: 'title',
      title: 'Title',
      render: (value: string, record: Notification) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 truncate max-w-xs">{record.message}</p>
        </div>
      ),
    },
    {
      key: 'recipients',
      title: 'Recipients',
      render: (value: string[]) => (
        <div className="text-sm text-gray-600">
          {value.length} recipient{value.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value: string, record: Notification) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(record)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {record.status === 'failed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResend(value)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: data?.total || 0,
    sent: data?.data.filter(n => n.status === 'sent').length || 0,
    pending: data?.data.filter(n => n.status === 'pending').length || 0,
    failed: data?.data.filter(n => n.status === 'failed').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage email notifications and alerts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Notifications</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            <p className="text-sm text-gray-600">Sent</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-gray-600">Failed</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex space-x-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {NOTIFICATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          emptyMessage="No notifications found"
        />

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

      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false })}
        title="Notification Details"
        size="lg"
      >
        {viewModal.notification && (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2 mb-2">
                {getTypeIcon(viewModal.notification.type)}
                <span className="font-medium capitalize">{viewModal.notification.type}</span>
                <Badge className={getStatusColor(viewModal.notification.status)}>
                  {viewModal.notification.status.charAt(0).toUpperCase() + viewModal.notification.status.slice(1)}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{viewModal.notification.title}</h3>
              <p className="text-sm text-gray-600">
                Created: {formatDate(viewModal.notification.createdAt)}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
              <p className="text-gray-700">{viewModal.notification.message}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recipients ({viewModal.notification.recipients.length})</h4>
              <div className="flex flex-wrap gap-2">
                {viewModal.notification.recipients.map((recipient, index) => (
                  <Badge key={index} variant="info">
                    {recipient}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotificationsPage;