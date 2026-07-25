import React, { useEffect, useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    ShoppingBag,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../store/authContext";
import { useCategories } from "../../services/categoriesService";
import { useProducts } from "../../services/productsService";
import { Product } from "../../types";

/* -------------------- Debounce Utility -------------------- */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
    let timer: ReturnType<typeof setTimeout>;

    const debounced = (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };

    debounced.cancel = () => clearTimeout(timer);

    return debounced;
}

/* -------------------- Component -------------------- */
const PublicProductsPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);

    /* ---------------- Data ---------------- */
    const { data: categoriesData } = useCategories({ limit: 100 });

    const {
        data: products,
        isLoading,
        isFetching,
    } = useProducts({
        page,
        limit: 12,
        search,
        category,
    });

    /* ---------------- Debounced Search ---------------- */
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearch(value);
            }, 500),
        [],
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    /* ---------------- Handlers ---------------- */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value); // instant typing
        debouncedSearch(value); // debounced API call
        setPage(1); // Reset to first page on search
    };

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        setPage(1); // Reset to first page on category change
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    const handleAddToCart = (product: Product) => {
        if (!isAuthenticated) {
            toast.error("Please login to add products to your cart");
            navigate("/login", { state: { from: location } });
            return;
        }
        toast.success(`${product.name} added to cart!`);
    };

    /* ---------------- Initial Loader ---------------- */
    if (isLoading && !products) {
        return <LoadingSpinner size="lg" className="py-20" />;
    }

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* ---------------- High-Impact Hero ---------------- */}
            <div className="relative pt-32 pb-24 md:pt-48 md:pb-36 bg-gray-900 overflow-hidden">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-70">
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none -translate-x-10 translate-y-10 text-white/10 italic">
                        Gear
                    </h1>
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none translate-x-1/2 -translate-y-10 text-blue-600/20 italic">
                        Power
                    </h1>
                </div>

                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym Background"
                        className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                    <div className="max-w-3xl">
                        <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-6 block">
                            Premium Selection
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] uppercase tracking-tighter mb-8 italic">
                            Equip <br />
                            Your <span className="text-blue-600">Hustle</span>.
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            Elite gear for serious athletes. From
                            high-performance supplements to heavy-duty
                            accessories, find everything you need to dominate
                            the arena.
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- Search & Filters Section ---------------- */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-grow w-full relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Search the armory..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-bold uppercase tracking-wider"
                            />
                            {isFetching && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <LoadingSpinner size="sm" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:w-auto">
                            <div className="relative w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        handleCategoryChange(e.target.value)
                                    }
                                    className="w-full pl-10 pr-10 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categoriesData?.data?.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {products?.data?.map((product: Product) => (
                        <Card
                            key={product.id}
                            className="group relative flex flex-col bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] overflow-hidden"
                        >
                            {/* Image Frame with Asymmetry */}
                            <div className="relative aspect-[4/5] p-4">
                                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gray-50 flex items-center justify-center transition-transform duration-700 group-hover:scale-[0.98]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Glassmorphic Category Badge */}
                                    {product.category && (
                                        <div className="absolute top-4 left-4 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-sm">
                                                {product.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Price Tag Overlay */}
                                    <div className="absolute bottom-4 right-4 bg-gray-900 px-4 py-2 rounded-2xl shadow-xl transition-all duration-500 group-hover:bg-blue-600 group-hover:-translate-y-2">
                                        <span className="text-white font-black text-lg">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow px-8 pb-8 pt-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="mt-auto">
                                    <Button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        Add to Gear
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* ---------------- Empty State ---------------- */}
                {!isFetching && products?.data?.length === 0 && (
                    <p className="text-center text-gray-500 py-16">
                        No products found
                    </p>
                )}

                {/* ---------------- Pagination ---------------- */}
                {products && products.totalPages > 1 && (
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 px-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="h-14 w-14 rounded-2xl flex items-center justify-center p-0 border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:border-gray-100 disabled:text-gray-400 transition-all"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>

                            <div className="flex items-center gap-2">
                                {[...Array(products.totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Basic logic to show first, last, and around current page
                                    if (
                                        p === 1 ||
                                        p === products.totalPages ||
                                        (p >= page - 1 && p <= page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() =>
                                                    handlePageChange(p)
                                                }
                                                className={`h-14 w-14 rounded-2xl text-sm font-black transition-all ${
                                                    page === p
                                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110"
                                                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (
                                        p === page - 2 ||
                                        p === page + 2
                                    ) {
                                        return (
                                            <span
                                                key={p}
                                                className="text-gray-300 px-1"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === products.totalPages}
                                className="h-14 w-14 rounded-2xl flex items-center justify-center p-0 border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:border-gray-100 disabled:text-gray-400 transition-all"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="text-gray-400 text-xs font-black uppercase tracking-widest">
                            Page <span className="text-gray-900">{page}</span>{" "}
                            of{" "}
                            <span className="text-gray-900">
                                {products.totalPages}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProductsPage;
