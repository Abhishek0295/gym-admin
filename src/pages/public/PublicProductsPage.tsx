import { Filter, Search, ShoppingBag } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useProducts } from '../../services/productsService';

const PublicProductsPage: React.FC = () => {
    const { data: products, isLoading } = useProducts({ page: 1, limit: 12 });

    if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Gym Essentials Shop</h1>
                    <p className="opacity-90 max-w-xl mx-auto">Get the best gear, supplements, and equipment to power your performance.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="flex-grow relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none">
                            <option>All Categories</option>
                            <option>Supplements</option>
                            <option>Gear</option>
                            <option>Equipment</option>
                        </select>
                        <Button variant="outline" className="flex items-center">
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products?.data.map((product) => (
                        <Card key={product.id} className="group overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-none">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase truncate">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{product.brand}</p>
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="text-2xl font-black text-gray-900">${product.price}</span>
                                    <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                                        <ShoppingBag className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicProductsPage;
