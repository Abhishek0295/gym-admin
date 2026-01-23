import { Mail, MapPin, Phone, Send } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ContactPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h1>
                    <p className="text-gray-600">Have questions? We're here to help you reach your goals.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Email Us</h3>
                        <p className="text-gray-600">contact@gymadmin.com</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Call Us</h3>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Visit Us</h3>
                        <p className="text-gray-600">123 Fitness St, NY 10001</p>
                    </div>
                </div>

                <Card className="p-8">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                placeholder="Membership Inquiry"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                rows={6}
                                placeholder="Tell us how we can help..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            ></textarea>
                        </div>
                        <Button className="w-full py-4 text-lg font-bold">
                            Send Message <Send className="ml-2 h-5 w-5" />
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ContactPage;
