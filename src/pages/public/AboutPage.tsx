import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">About GymAdmin</h1>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1571902251103-d830f839855b?q=80&w=1974&auto=format&fit=crop"
                        alt="Our Story"
                        className="rounded-2xl shadow-xl"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-wide">Our Story</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Founded in 2020, GymAdmin was built to simplify the fitness journey for both enthusiasts and business owners. We believe that
                        technology should empower health, not complicate it.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Today, we serve thousands of users, providing premium equipment and connecting them with world-class trainers. Our mission is
                        to make elite fitness accessible to everyone.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <p className="text-3xl font-bold text-blue-600">5k+</p>
                            <p className="text-gray-600">Active Members</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <p className="text-3xl font-bold text-blue-600">100+</p>
                            <p className="text-gray-600">Certified Trainers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
