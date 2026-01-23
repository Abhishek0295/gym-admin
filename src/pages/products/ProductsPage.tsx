import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { useDeleteProduct, useProducts } from '../../services/productsService';
import { Product } from '../../types';
import { PRODUCT_STATUSES } from '../../utils/constants';
import { debounce, formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const ProductsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; product?: Product }>({ open: false });

    const pagination = usePagination();

    const { data, isLoading } = useProducts({
        page: pagination.page,
        limit: pagination.limit,
        search,
        category,
        status,
    });

    const deleteProductMutation = useDeleteProduct();

    const handleSearch = debounce((value: string) => {
        setSearch(value);
        pagination.resetPagination();
    }, 300);

    const handleDelete = (product: Product) => {
        setDeleteModal({ open: true, product });
    };

    const confirmDelete = () => {
        if (deleteModal.product) {
            deleteProductMutation.mutate(deleteModal.product.id);
            setDeleteModal({ open: false });
        }
    };

    const columns = [
        {
            key: 'image',
            title: 'Image',
            render: (value: string) => <img src={value} alt="Product" className="w-12 h-16 object-cover rounded" />,
        },
        {
            key: 'title',
            title: 'Product Name',
            render: (value: string, record: Product) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{record.brand}</p>
                </div>
            ),
        },
        {
            key: 'category',
            title: 'Category',
        },
        {
            key: 'status',
            title: 'Status',
            render: (value: string) => <Badge className={getStatusColor(value)}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge>,
        },
        {
            key: 'price',
            title: 'Price',
            render: (value: number) => formatCurrency(value),
        },
        {
            key: 'createdAt',
            title: 'Created',
            render: (value: string) => formatDate(value),
        },
        {
            key: 'id',
            title: 'Actions',
            render: (value: string, record: Product) => (
                <div className="flex space-x-2">
                    <Link to={`/products/${value}`}>
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link to={`/products/${value}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(record)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your gym products catalog</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="Protein">Protein</option>
                            <option value="Supplements">Supplements</option>
                            <option value="Workout Gear">Workout Gear</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            {PRODUCT_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable columns={columns} data={data?.data || []} loading={isLoading} emptyMessage="No products found" />

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

            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false })} title="Delete Product">
                <div className="space-y-4">
                    <p className="text-gray-600">Are you sure you want to delete "{deleteModal.product?.title}"? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setDeleteModal({ open: false })}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} loading={deleteProductMutation.isPending}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductsPage;
