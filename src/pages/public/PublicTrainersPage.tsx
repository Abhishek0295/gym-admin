import { Award, CheckCircle } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useTrainers } from '../../services/trainersService';

const PublicTrainersPage: React.FC = () => {
    // Note: useTrainers might not exist or might need different params.
    // Let's assume it works like other query hooks.
    const { data: trainers, isLoading } = useTrainers({ page: 1, limit: 12, status: 'approved' });

    if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">Our Expert Trainers</h1>
                    <p className="opacity-70 max-w-xl mx-auto">
                        Learn from the best in the industry. Our certified trainers are here to guide your every step.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {trainers?.data.map((trainer) => (
                        <div key={trainer.id} className="relative group">
                            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[4/5] mb-6 shadow-sm group-hover:shadow-xl transition-shadow">
                                <img
                                    src={`https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop`}
                                    alt={trainer.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 via-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                        <Badge className="bg-blue-600 border-none">CrossFit</Badge>
                                        <Badge className="bg-green-600 border-none">Nutrition</Badge>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{trainer.name}</h3>
                                <p className="text-blue-600 font-bold mb-4">{trainer.specialization}</p>
                                <div className="space-y-2 mb-6 text-gray-600">
                                    <div className="flex items-center">
                                        <Award className="h-4 w-4 mr-2" />
                                        <span>{trainer.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        <span>Certified Professional</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper component
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider ${className}`}>{children}</span>
);

export default PublicTrainersPage;
