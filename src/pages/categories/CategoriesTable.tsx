import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/tables/DataTable';
import { formatDate } from '../../utils/helpers';

interface CategoriesTableProps {
    data: Category[];
    loading: boolean;
    onToggle: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ data, loading, onToggle, onDelete }) => {
    const columns = [
        {
            key: 'name',
            title: 'Name',
            render: (value: string, record: Category) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{record.description}</p>
                </div>
            ),
        },
        {
            key: 'isActive',
            title: 'Status',
            render: (value: boolean) => (
                <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'isTopGenre',
            title: 'Top Genre',
            render: (value: boolean) => (
                <Badge className={value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {value ? 'Yes' : 'No'}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            title: 'Created',
            render: (value: string) => formatDate(value),
        },
        {
            key: 'id',
            title: 'Actions',
            render: (_: string, record: Category) => (
                <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onToggle(record)} className={record.isActive ? 'text-orange-600' : 'text-green-600'}>
                        {record.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(record)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return <DataTable columns={columns} data={data} loading={loading} emptyMessage="No categories found" />;
};

export default CategoriesTable;
