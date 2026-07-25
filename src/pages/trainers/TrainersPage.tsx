import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Dumbbell, 
    Phone, 
    Mail, 
    Award, 
    Clock, 
    X,
    UserCheck,
    CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { 
    useTrainers, 
    useCreateTrainer, 
    useUpdateTrainer, 
    useDeleteTrainer 
} from '../../services/trainersService';
import { Trainer } from '../../types';

const TrainersPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    // Modals
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; trainerId?: string; trainerName?: string }>({ open: false });

    const pagination = usePagination();

    const { data: trainersData, isLoading } = useTrainers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status,
    });

    const trainers = trainersData?.data || [];
    const totalTrainers = trainersData?.total || 0;
    const totalPages = trainersData?.totalPages || 1;

    const createTrainerMutation = useCreateTrainer();
    const updateTrainerMutation = useUpdateTrainer();
    const deleteTrainerMutation = useDeleteTrainer();

    // Formik & Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().trim().required('Trainer Name is required'),
        email: Yup.string().trim().email('Invalid email address').required('Email is required'),
        phone: Yup.string().trim().nullable(),
        specialization: Yup.string().trim().required('Specialization is required'),
        experience: Yup.number().typeError('Experience must be a number').min(0, 'Cannot be negative').required('Experience (Years) is required'),
        status: Yup.string().oneOf(['active', 'inactive']).required(),
    });

    const formik = useFormik({
        initialValues: {
            name: selectedTrainer?.name || '',
            email: selectedTrainer?.email || '',
            phone: selectedTrainer?.phone || '',
            specialization: selectedTrainer?.specialization || '',
            experience: selectedTrainer?.experience || 1,
            status: selectedTrainer?.status || 'active',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            if (selectedTrainer) {
                updateTrainerMutation.mutate(
                    {
                        id: selectedTrainer.id,
                        ...values,
                    },
                    {
                        onSuccess: () => {
                            setIsAddEditModalOpen(false);
                            setSelectedTrainer(null);
                        },
                    }
                );
            } else {
                createTrainerMutation.mutate(values, {
                    onSuccess: () => {
                        setIsAddEditModalOpen(false);
                        formik.resetForm();
                    },
                });
            }
        },
    });

    const handleOpenAddModal = () => {
        setSelectedTrainer(null);
        formik.resetForm();
        setIsAddEditModalOpen(true);
    };

    const handleOpenEditModal = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteTrainer = () => {
        if (deleteModal.trainerId) {
            deleteTrainerMutation.mutate(deleteModal.trainerId, {
                onSuccess: () => setDeleteModal({ open: false }),
            });
        }
    };

    return (
        <div className="space-y-6 text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gym Trainers & Instructors</h1>
                    <p className="text-sm text-gray-500">Manage certified trainers, specializations, and schedules</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex-shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Add New Trainer
                </button>
            </div>

            {/* Filter & Search Bar */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search trainers by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                pagination.goToPage(1);
                            }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            pagination.goToPage(1);
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </Card>

            {/* Trainer List */}
            <Card className="overflow-hidden p-0">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Loading trainers...</div>
                ) : trainers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-base font-semibold text-gray-700">No trainers registered yet</p>
                        <button
                            onClick={handleOpenAddModal}
                            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                        >
                            + Add First Gym Trainer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase">
                                        <th className="py-3.5 px-4">Trainer Name & Email</th>
                                        <th className="py-3.5 px-4">Specialization</th>
                                        <th className="py-3.5 px-4">Experience</th>
                                        <th className="py-3.5 px-4">Phone</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {trainers.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                                                        {t.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{t.name}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {t.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                                                    <Award className="h-3.5 w-3.5" />
                                                    {t.specialization || 'Personal Training'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-700 font-medium">
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                    {t.experience || 1} Year(s)
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">
                                                {t.phone ? (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                        {t.phone}
                                                    </span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                                    t.status === 'active' || t.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                                        t.status === 'active' || t.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`} />
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(t)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Trainer"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, trainerId: t.id, trainerName: t.name })}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Trainer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={totalPages}
                                    onPageChange={pagination.goToPage}
                                    totalItems={totalTrainers}
                                    itemsPerPage={pagination.limit}
                                />
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Add / Edit Trainer Modal */}
            {isAddEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {selectedTrainer ? 'Edit Gym Trainer' : 'Add New Gym Trainer'}
                                </h3>
                                <p className="text-xs text-gray-500">Enter trainer details and specialization</p>
                            </div>
                            <button
                                onClick={() => setIsAddEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g. Vikram Singh"
                                    className={`w-full rounded-lg border p-2 text-sm text-gray-900 ${
                                        formik.touched.name && formik.errors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="vikram@gym.com"
                                        className={`w-full rounded-lg border p-2 text-sm text-gray-900 ${
                                            formik.touched.email && formik.errors.email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-xs text-red-500 mt-1 font-medium">{formik.errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        placeholder="9876543210"
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Specialization & Experience */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Specialization *
                                    </label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formik.values.specialization}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="e.g. Bodybuilding, Yoga"
                                        className={`w-full rounded-lg border p-2 text-sm text-gray-900 ${
                                            formik.touched.specialization && formik.errors.specialization
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                    />
                                    {formik.touched.specialization && formik.errors.specialization && (
                                        <p className="text-xs text-red-500 mt-1 font-medium">{formik.errors.specialization}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Experience (Years) *
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        min="0"
                                        value={formik.values.experience}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Account Status
                                </label>
                                <select
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white text-gray-900"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddEditModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTrainerMutation.isPending || updateTrainerMutation.isPending}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    {createTrainerMutation.isPending || updateTrainerMutation.isPending
                                        ? 'Saving...'
                                        : selectedTrainer
                                        ? 'Update Trainer'
                                        : 'Save Trainer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-gray-100">
                        <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                            <Trash2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Delete Trainer</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Are you sure you want to remove <span className="font-semibold text-gray-800">{deleteModal.trainerName}</span>?
                            </p>
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModal({ open: false })}
                                className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTrainer}
                                disabled={deleteTrainerMutation.isPending}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                                {deleteTrainerMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainersPage;
