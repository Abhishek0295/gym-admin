import { ArrowLeft, Calendar, DollarSign, Edit, Tag } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useProduct } from "../../services/productsService";
import {
    formatCurrency,
    formatDate,
    getStatusColor,
} from "../../utils/helpers";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading } = useProduct(id!);

    if (isLoading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Product not found</p>
                <Link to="/products">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/products">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                    </div>
                </div>
                <Link to={`/products/${id}/edit`}>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <div className="text-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                            />
                            <div className="mt-4 space-y-2">
                                <Badge
                                    className={getStatusColor(product.status)}
                                >
                                    {product.status.charAt(0).toUpperCase() +
                                        product.status.slice(1)}
                                </Badge>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Product Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <Tag className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Category
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {product.category}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Price
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Created
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(product.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Last Updated
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(product.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Product Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Product ID:
                                </span>
                                <span className="font-mono text-sm">
                                    {product.id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge
                                    className={getStatusColor(product.status)}
                                >
                                    {product.status.charAt(0).toUpperCase() +
                                        product.status.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
