import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus,
  Search,
  AlertCircle,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseInput from '../../../shared/components/base/BaseInput';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_stock':
      return 'success';
    case 'low_stock':
      return 'warning';
    case 'out_of_stock':
      return 'error';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Fetch inventory data
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['partnerInventory'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          items: [
            {
              id: '1',
              name: 'Fresh Produce',
              category: 'Vegetables',
              quantity: 150,
              unit: 'lbs',
              expirationDate: '2024-02-01',
              status: 'in_stock'
            },
            {
              id: '2',
              name: 'Canned Soup',
              category: 'Non-Perishable',
              quantity: 50,
              unit: 'cans',
              expirationDate: '2024-06-01',
              status: 'low_stock'
            },
            {
              id: '3',
              name: 'Bread',
              category: 'Bakery',
              quantity: 0,
              unit: 'loaves',
              expirationDate: '2024-01-28',
              status: 'out_of_stock'
            }
          ] as InventoryItem[]
        };
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        throw error;
      }
    }
  });

  const sortedAndFilteredItems = React.useMemo(() => {
    let items = [...(inventoryData?.items || [])];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    items.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  }, [inventoryData?.items, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your food inventory
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <BaseInput
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <BaseButton
          variant="default"
          size="default"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </BaseButton>
      </div>

      {/* Inventory Table */}
      <BaseCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Item Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Category</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Quantity</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('expirationDate')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Expiration</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Status</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedAndFilteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <BaseText weight="medium">{item.name}</BaseText>
                  </td>
                  <td className="px-4 py-3">
                    <BaseText>{item.category}</BaseText>
                  </td>
                  <td className="px-4 py-3">
                    <BaseText>{item.quantity} {item.unit}</BaseText>
                  </td>
                  <td className="px-4 py-3">
                    <BaseText>{formatDate(item.expirationDate)}</BaseText>
                  </td>
                  <td className="px-4 py-3">
                    <BaseBadge variant={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </BaseBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </BaseButton>
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </BaseButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {(!inventoryData?.items || inventoryData.items.length === 0) && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <BaseText variant="muted" className="mt-2">
                  No inventory items found
                </BaseText>
                <BaseButton
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Add First Item
                </BaseButton>
              </div>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 
