import {
    ArrowRight,
    Shield,
    ShoppingBag,
    Star,
    Users,
    Zap,
} from "lucide-react";
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useProducts } from "../../services/productsService";
import { useAuth } from "../../store/authContext";
import toast from "react-hot-toast";

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: productsData, isLoading } = useProducts({
        page: 1,
        limit: 4,
    });
    const products = productsData?.data || [];

    const handleAddToCart = (product: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to add products to your cart");
            navigate("/login", { state: { from: location } });
            return;
        }
        // Logic for adding to cart goes here
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="flex flex-col bg-white overflow-x-hidden">
            {/* ---------------- High-Impact Hero ---------------- */}
            <section className="relative min-h-[85vh] flex items-center bg-gray-900 text-white overflow-hidden pt-20">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-10">
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none -translate-x-10 translate-y-10 text-white/5 italic">
                        Unleash
                    </h1>
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none translate-x-1/2 -translate-y-10 text-blue-600/10 italic">
                        Elite
                    </h1>
                </div>

                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym"
                        className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-sm mb-6 block">
                            The Future of Fitness
                        </span>
                        <h1 className="text-6xl md:text-[120px] font-black leading-[0.8] uppercase tracking-tighter mb-8 italic">
                            Forge <br />
                            Your <span className="text-blue-600">Legacy</span>.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-medium">
                            Premium gear, world-class trainers, and an
                            unbreakable community. Join the elite and redefine
                            your limits today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/shop">
                                <Button
                                    size="lg"
                                    className="px-10 py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 rounded-2xl shadow-2xl shadow-blue-500/20 hover:scale-[1.05] transition-all"
                                >
                                    Gear Up <ShoppingBag className="h-6 w-6" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-10 py-5 text-lg font-black uppercase tracking-widest border-2 border-white/20 text-white hover:bg-white hover:text-black rounded-2xl transition-all"
                                >
                                    Our Story
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------- Creative Features Section ---------------- */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-end mb-24">
                        <div className="lg:w-1/2">
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4 block">
                                Superiority
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                Why We <br />
                                <span className="text-blue-600">Dominate</span>.
                            </h2>
                        </div>
                        <div className="lg:w-1/2">
                            <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-lg">
                                We don't just provide equipment; we provide the
                                arsenal for your transformation. Every tool and
                                trainer is vetted for one goal: Your absolute
                                success.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <div className="group relative pt-12">
                            <div className="absolute top-0 left-8 w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 rotate-6 group-hover:rotate-0 transition-transform duration-500 z-10">
                                <Shield className="h-8 w-8" />
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] transition-all duration-500">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-4 mt-4">
                                    Apex Quality
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Only the highest-grade materials and
                                    scientifically-backed supplements enter our
                                    shop.
                                </p>
                            </div>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="group relative pt-12 md:mt-12">
                            <div className="absolute top-0 left-8 w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-gray-900/20 -rotate-6 group-hover:rotate-0 transition-transform duration-500 z-10">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] transition-all duration-500">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-4 mt-4">
                                    Titan Coaching
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Direct access to world-class athletes and
                                    certified professionals dedicated to your
                                    growth.
                                </p>
                            </div>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="group relative pt-12 md:-mt-8">
                            <div className="absolute top-0 left-8 w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500 z-10">
                                <Zap className="h-8 w-8" />
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] transition-all duration-500">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-4 mt-4">
                                    Relentless Ops
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    An unbreakable support system ensuring your
                                    gear arrives fast and your questions are
                                    answered.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------- Popular Products Mini-Shop ---------------- */}
            <section className="py-32 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                        <div>
                            <span className="text-blue-500 font-black uppercase tracking-widest text-sm mb-4 block">
                                The Armory
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                                Elite{" "}
                                <span className="text-blue-600">Selection</span>
                                .
                            </h2>
                        </div>
                        <Link
                            to="/shop"
                            className="group flex items-center gap-4 bg-white px-8 py-4 rounded-2xl border border-gray-200 font-black uppercase tracking-widest text-sm hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                        >
                            View All Gear{" "}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {isLoading
                            ? [1, 2, 3, 4].map((i) => (
                                  <div
                                      key={i}
                                      className="animate-pulse bg-white rounded-[2.5rem] h-[500px] border border-gray-100"
                                  ></div>
                              ))
                            : products.map((product: any) => (
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
                                                          {
                                                              product.category
                                                                  .name
                                                          }
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
                                                  onClick={() =>
                                                      handleAddToCart(product)
                                                  }
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
                </div>
            </section>

            {/* ---------------- CTA Section ---------------- */}
            <section className="relative py-48 bg-gray-900 overflow-hidden">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-5">
                    <h1 className="text-[40vw] font-black uppercase tracking-tighter leading-none translate-x-1/5 translate-y-20 text-white italic">
                        Now
                    </h1>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter leading-none">
                            Ready to <br />
                            <span className="text-blue-600">Transform?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                            Join over 5,000+ warriors who have achieved their
                            peak performance with GymAdmin.
                        </p>
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className="px-16 py-6 text-xl font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-blue-500/20 hover:scale-[1.05] transition-all"
                            >
                                Join the Elite
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
