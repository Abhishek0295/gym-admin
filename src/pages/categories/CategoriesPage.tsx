import { Plus, Search } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { usePagination } from '../../hooks/usePagination';
import { Category } from '../../types';
import { useDeleteCategory, useToggleCategory, useCategories } from './useCategories';
import CategoriesTable from './CategoriesTable';

const CategoriesPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search, 300);
    const pagination = usePagination();
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; category?: Category }>({ open: false });

    const { data, isLoading } = useCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
    });
    const toggleMutation = useToggleCategory();
    const deleteMutation = useDeleteCategory();

    const handleToggle = useCallback(
        (category: Category) => {
            toggleMutation.mutate({ id: category.id, isActive: !category.isActive });
        },
        [toggleMutation]
    );

    const handleDelete = useCallback((category: Category) => setDeleteModal({ open: true, category }), []);
    const confirmDelete = useCallback(() => deleteModal.category && deleteMutation.mutate(deleteModal.category.id), [deleteModal, deleteMutation]);

    // const topGenres = data?.data.filter(cat => cat.isTopGenre).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    // const topGenres = [{ id: '1', name: 'Genre 1', description: 'Description 1' }, { id: '2', name: 'Genre 2', description: 'Description 2' }, { id: '3', name: 'Genre 3', description: 'Description 3' }];
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">Manage product categories and types</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Top Genres */}
            {/* <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Genres (Drag to reorder)</h2>
        <div className="space-y-2">
          {topGenres.length > 0 ? topGenres.map((genre) => (
            <div key={genre.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-move">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{genre.name}</p>
                <p className="text-sm text-gray-500">{genre.description}</p>
              </div>
            </div>
          )) : <p className="text-gray-500 text-center py-4">No top genres configured</p>}
        </div>
      </Card> */}

            {/* Search + Table */}
            <Card>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                pagination.resetPagination();
                            }}
                        />
                    </div>
                </div>

                <CategoriesTable data={data?.data || []} loading={isLoading} onToggle={handleToggle} onDelete={handleDelete} />

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

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false })} title="Delete Category">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete "{deleteModal.category?.name}"? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setDeleteModal({ open: false })}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} loading={deleteMutation.isPending}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CategoriesPage;
