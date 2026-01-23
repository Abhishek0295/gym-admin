import React, { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, CreditCard } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plan, Commission } from '../../types';
import { QUERY_KEYS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CurrencyPage: React.FC = () => {
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; plan?: Plan }>({ open: false });
  const queryClient = useQueryClient();
  
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLANS],
    queryFn: async () => {
      const response = await api.get('/plans');
      return response.data.data as Plan[];
    },
  });

  const { data: commissions, isLoading: commissionsLoading } = useQuery({
    queryKey: [QUERY_KEYS.COMMISSIONS],
    queryFn: async () => {
      const response = await api.get('/commissions');
      return response.data.data as Commission[];
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/plans/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLANS] });
      toast.success('Plan deleted successfully!');
      setDeleteModal({ open: false });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    },
  });

  const updateCommissionMutation = useMutation({
    mutationFn: async (data: { creatorPercentage: number; platformPercentage: number }) => {
      const response = await api.post('/commissions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMISSIONS] });
      toast.success('Commission updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update commission');
    },
  });

  const handleDeletePlan = (plan: Plan) => {
    setDeleteModal({ open: true, plan });
  };

  const confirmDelete = () => {
    if (deleteModal.plan) {
      deletePlanMutation.mutate(deleteModal.plan.id);
    }
  };

  const planColumns = [
    {
      key: 'name',
      title: 'Plan Name',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'riftShardsConversion',
      title: 'RiftShards',
      render: (value: number) => (
        <span className="text-blue-600 font-medium">{value} RS</span>
      ),
    },
    {
      key: 'features',
      title: 'Features',
      render: (value: string[]) => (
        <div className="text-sm text-gray-600">
          {value.slice(0, 2).join(', ')}
          {value.length > 2 && ` +${value.length - 2} more`}
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value: string, record: Plan) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePlan(record)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const currentCommission = commissions?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Currency & Plans</h1>
          <p className="text-gray-600">Manage subscription plans and commission rates</p>
        </div>
      </div>

      {/* Commission Settings */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Commission Settings</h2>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Update Rates
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Creator Percentage</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCommission?.creatorPercentage || 70}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Percentage</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCommission?.platformPercentage || 30}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <DataTable
          columns={planColumns}
          data={plans || []}
          loading={plansLoading}
          emptyMessage="No plans found"
        />
      </Card>

      {/* Plan Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {formatCurrency(plan.price)}
                <span className="text-sm text-gray-500 font-normal">/month</span>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-blue-800 font-medium">
                  {plan.riftShardsConversion} RiftShards included
                </p>
              </div>
              
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePlan(plan)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        title="Delete Plan"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteModal.plan?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deletePlanMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CurrencyPage;