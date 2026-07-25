import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import FormField from "./FormField";
import Button from "../ui/Button";
import { useCreateProduct } from "../../services/productsService";
import { useCategories } from "../../services/categoriesService";

/* ===================== SCHEMA ===================== */

const productSchema = yup
    .object({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
        price: yup
            .number()
            .typeError("Price must be a number")
            .positive("Price must be positive")
            .required("Price is required"),
        category: yup.string().required("Category is required"),
        status: yup
            .mixed<"published" | "draft" | "pending">()
            .oneOf(["published", "draft", "pending"])
            .required("Status is required"),
        image: yup.string().url("Invalid URL").nullable().optional(),
    })
    .defined();

type ProductFormData = yup.InferType<typeof productSchema>;

interface ProductFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

/* ===================== COMPONENT ===================== */

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onCancel }) => {
    const { data: categoriesData } = useCategories({ page: 1, limit: 100 });
    const createProductMutation = useCreateProduct();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        defaultValues: {
            status: "draft",
        },
    });

    const imageUrl = watch("image");

    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        createProductMutation.mutate(
            {
                ...data,
                image: data.image || undefined,
            },
            {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            },
        );
    };

    const categories = categoriesData?.data ?? [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Product Name"
                    registration={register("name")}
                    error={errors.name?.message}
                    placeholder="e.g. Whey Protein Powder"
                    required
                />

                <FormField
                    label="Price (₹)"
                    type="number"
                    registration={register("price", { valueAsNumber: true })}
                    error={errors.price?.message}
                    placeholder="0.00"
                    required
                />
            </div>

            <FormField
                label="Description"
                as="textarea"
                registration={register("description")}
                error={errors.description?.message}
                placeholder="Enter detailed product description"
                rows={3}
                required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("category")}
                        className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.category.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("status")}
                        className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <FormField
                    label="Image URL"
                    registration={register("image")}
                    error={errors.image?.message}
                    placeholder="https://example.com/image.jpg"
                />

                {imageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-12 w-12 object-cover rounded-md border border-gray-200"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                            }}
                        />
                        <span className="text-xs text-gray-500 truncate">Image Preview</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="w-full sm:w-auto h-11"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={createProductMutation.isPending}
                    className="w-full sm:w-auto h-11"
                >
                    {createProductMutation.isPending
                        ? "Creating..."
                        : "Create Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
