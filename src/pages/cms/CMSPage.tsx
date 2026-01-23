import React, { useState } from 'react';
import { Plus, Edit, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { CMSPage } from '../../types';
import { QUERY_KEYS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CMSPag: React.FC = () => {
  const [previewModal, setPreviewModal] = useState<{ open: boolean; page?: CMSPage }>({ open: false });
  const queryClient = useQueryClient();
  
  const { data: cmsPages, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CMS_PAGES],
    queryFn: async () => {
      const response = await api.get('/cms');
      return response.data.data as CMSPage[];
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const response = await api.put(`/cms/${id}`, { isPublished });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CMS_PAGES] });
      toast.success('Page status updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update page');
    },
  });

  const handleTogglePublish = (page: CMSPage) => {
    togglePublishMutation.mutate({
      id: page.id,
      isPublished: !page.isPublished,
    });
  };

  const handlePreview = (page: CMSPage) => {
    setPreviewModal({ open: true, page });
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      render: (value: string, record: CMSPage) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">/{record.slug}</p>
        </div>
      ),
    },
    {
      key: 'isPublished',
      title: 'Status',
      render: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'lastModified',
      title: 'Last Modified',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value: string, record: CMSPage) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePreview(record)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTogglePublish(record)}
            className={record.isPublished ? 'text-orange-600' : 'text-green-600'}
          >
            {record.isPublished ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS</h1>
          <p className="text-gray-600">Manage static pages and content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={cmsPages || []}
          loading={isLoading}
          emptyMessage="No pages found"
        />
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cmsPages?.slice(0, 3).map((page) => (
          <Card key={page.id}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Last updated: {formatDate(page.lastModified)}
              </p>
              <Badge className={page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {page.isPublished ? 'Published' : 'Draft'}
              </Badge>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePreview(page)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={previewModal.open}
        onClose={() => setPreviewModal({ open: false })}
        title={previewModal.page?.title}
        size="xl"
      >
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-600">
              Slug: /{previewModal.page?.slug}
            </p>
            <p className="text-sm text-gray-600">
              Status: {previewModal.page?.isPublished ? 'Published' : 'Draft'}
            </p>
          </div>
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: previewModal.page?.content || ''
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CMSPag;