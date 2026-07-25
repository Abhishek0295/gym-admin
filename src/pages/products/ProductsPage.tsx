import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/tables/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useCategories } from "../../services/categoriesService";
import { useDeleteProduct, useProducts } from "../../services/productsService";
import { Product } from "../../types";
import { PRODUCT_STATUSES } from "../../utils/constants";
import {
    debounce,
    formatCurrency,
    formatDate,
    getStatusColor,
} from "../../utils/helpers";
import ProductForm from "../../components/forms/ProductForm";

const ProductsPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        product?: Product;
    }>({ open: false });
    const [addModal, setAddModal] = useState(false);

    const { data: categoriesData } = useCategories({ limit: 100 });
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
            key: "image",
            title: "Image",
            render: (value: string) => (
                <img
                    src={value}
                    alt="Product"
                    className="w-12 h-16 object-cover rounded"
                />
            ),
        },
        {
            key: "name",
            title: "Product Name",
            render: (value: string) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                </div>
            ),
        },
        {
            key: "category",
            title: "Category",
            render: (value: any) => value?.name || "N/A",
        },
        {
            key: "status",
            title: "Status",
            render: (value: string) => (
                <Badge className={getStatusColor(value)}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            ),
        },
        {
            key: "price",
            title: "Price",
            render: (value: number) => formatCurrency(value),
        },
        {
            key: "createdAt",
            title: "Created",
            render: (value: string) => formatDate(value),
        },
        {
            key: "id",
            title: "Actions",
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Products
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Manage your gym products catalog
                    </p>
                </div>
                <Button onClick={() => setAddModal(true)} className="w-full sm:w-auto justify-center h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
                    <div className="flex-1 w-full max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="pl-10 pr-4 py-2 w-full h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex gap-2">
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                pagination.resetPagination();
                            }}
                            className="px-3 py-2 h-10 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categoriesData?.data?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                pagination.resetPagination();
                            }}
                            className="px-3 py-2 h-10 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Mobile View: Product Cards */}
                <div className="block md:hidden">
                    {isLoading ? (
                        <div className="py-12 text-center text-sm text-gray-500">Loading products...</div>
                    ) : !data?.data || data.data.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500">No products found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {data.data.map((product) => (
                                <div key={product.id} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/150'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                                            <p className="text-xs text-gray-500 truncate mb-1">
                                                {product.category?.name || "Uncategorized"}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(product.status)}>
                                                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                                </Badge>
                                                <span className="font-bold text-sm text-blue-600">
                                                    {formatCurrency(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                                        <Link to={`/products/${product.id}`} className="flex-1">
                                            <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link to={`/products/${product.id}/edit`} className="flex-1">
                                            <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
                                                <Edit className="h-3.5 w-3.5 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(product)}
                                            className="flex-1 text-xs text-red-600 justify-center"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop View: Data Table */}
                <div className="hidden md:block">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        loading={isLoading}
                        emptyMessage="No products found"
                    />
                </div>

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
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false })}
                title="Delete Product"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete "
                        <span className="font-semibold text-gray-800">{deleteModal.product?.name}</span>"? This action cannot be
                        undone.
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ open: false })}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            loading={deleteProductMutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                title="Add New Product"
            >
                <ProductForm
                    onSuccess={() => setAddModal(false)}
                    onCancel={() => setAddModal(false)}
                />
            </Modal>
        </div>
    );
};

export default ProductsPage;
