import { ArrowRight, Shield, ShoppingBag, Star, Users, Zap } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LandingPage: React.FC = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym"
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            PUSH YOUR <span className="text-blue-500">LIMITS</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Upgrade your training with premium gear and world-class trainers. Join the GymAdmin community today and transform your
                            fitness journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/shop">
                                <Button size="lg" className="px-8 flex items-center justify-center">
                                    Shop Gear <ShoppingBag className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="px-8 border-white text-white hover:bg-white hover:text-gray-900">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GymAdmin?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We provide the best environment and tools for your fitness success.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                            <p className="text-gray-600">Top-tier equipment and supplements curated for maximum results.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert Trainers</h3>
                            <p className="text-gray-600">Professional support from certified trainers dedicated to your goals.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Dynamic Support</h3>
                            <p className="text-gray-600">24/7 community and customer support to keep you moving forward.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Mini-Shop */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Products</h2>
                            <p className="text-gray-600">Most loved by our community</p>
                        </div>
                        <Link to="/shop" className="text-blue-600 font-semibold flex items-center hover:underline">
                            View all shop <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Mock Products */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="h-64 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={`https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop`}
                                        alt="Product"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded text-xs font-bold text-blue-600">
                                        Best Seller
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-blue-500 font-bold uppercase mb-1">Supplements</p>
                                    <h3 className="font-bold text-gray-900 mb-2">Organic Whey Protein {i}</h3>
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">(44)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">$49.99</span>
                                        <Button size="sm">Add</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Start Your Transformation Today</h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Join over 5,000+ members who have achieved their fitness dreams with GymAdmin.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-12">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
