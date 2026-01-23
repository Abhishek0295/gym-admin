import React, { useState } from 'react';
import { Search, Filter, DollarSign, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePagination } from '../../hooks/usePagination';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import Pagination from '../../components/ui/Pagination';
import api from '../../services/api';
import { Transaction, PaginatedResponse } from '../../types';
import { QUERY_KEYS, TRANSACTION_TYPES } from '../../utils/constants';
import { formatDate, formatCurrency, getStatusColor, debounce } from '../../utils/helpers';

const TransactionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  
  const pagination = usePagination();
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, { page: pagination.page, limit: pagination.limit, search, type, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(type && { type }),
        ...(status && { status }),
      });
      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data.data as PaginatedResponse<Transaction>;
    },
  });

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    pagination.resetPagination();
  }, 300);

  const columns = [
    {
      key: 'id',
      title: 'Transaction ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'userName',
      title: 'User',
      render: (value: string, record: Transaction) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 font-mono">{record.userId}</p>
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {value === 'pay-in' ? (
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          )}
          <Badge className={value === 'pay-in' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {value === 'pay-in' ? 'Pay-in' : 'Payout'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
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
      key: 'description',
      title: 'Description',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value: string, record: Transaction) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const totalPayIns = data?.data.filter(t => t.type === 'pay-in').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalPayouts = data?.data.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage all financial transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100">
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pay-ins</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayIns)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayouts)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayIns - totalPayouts)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {TRANSACTION_TYPES.map((type) => (
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          emptyMessage="No transactions found"
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
    </div>
  );
};

export default TransactionsPage;