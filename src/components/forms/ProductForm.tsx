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
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        defaultValues: {
            status: "draft",
        },
    });

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Product Name"
                    registration={register("name")}
                    error={errors.name?.message}
                    placeholder="Enter product name"
                    required
                />

                <FormField
                    label="Price"
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
                placeholder="Enter product description"
                rows={4}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("category")}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.category.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("status")}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <FormField
                label="Image URL"
                registration={register("image")}
                error={errors.image?.message}
                placeholder="https://example.com/image.jpg"
            />

            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={createProductMutation.isPending}
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
