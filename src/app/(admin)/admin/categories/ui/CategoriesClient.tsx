'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { TabsNavigation } from '@/components';
import { createCategory, deleteCategory, updateCategory, uploadImages } from '@/actions';
import { CategoryFilters } from './CategoryFilters';
import { CategoryList } from './CategoryList';
import { CategoryForm } from './CategoryForm';
import { fuzzyFilter } from '@/utils/search/fuzzy-search';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  isHidden: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
    children: number;
  };
  media: Array<{
    id: string;
    url: string;
    isMain: boolean;
    alt: string | null;
  }>;
  parent?: {
    id: string;
    name: string;
  } | null;
}

interface Props {
  initialCategories: Category[];
}

const tabs = [
  { name: 'Productos', href: '/admin/products' },
  { name: 'Categorías', href: '/admin/categories' },
  { name: 'Atributos', href: '/admin/attributes' },
];

export function CategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParent, setFilterParent] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    imageFile: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  // Filtrar categorías con fuzzy search
  const filteredCategories = useMemo(() => {
    let result = categories;

    // 1. Búsqueda fuzzy por nombre
    if (searchTerm.trim()) {
      result = fuzzyFilter(
        result,
        searchTerm,
        (cat) => cat.name,
        50 // threshold permisivo
      );
    }

    // 2. Filtrar por padre
    if (filterParent === 'main') {
      result = result.filter((cat) => !cat.parentId);
    } else if (filterParent !== 'all') {
      result = result.filter((cat) => cat.parentId === filterParent);
    }

    return result;
  }, [categories, searchTerm, filterParent]);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <TabsNavigation tabs={tabs} />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  const handleFormChange = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const handleImageChange = (file: File, preview: string) => {
    setFormData({ ...formData, imageFile: file });
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageFile: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (formData.imageFile) {
        const uploadedUrls = await uploadImages([formData.imageFile]);
        if (uploadedUrls && uploadedUrls.length > 0) {
          imageUrl = uploadedUrls[0];
        }
      }

      if (editingId) {
        // Update existing category
        const result = await updateCategory({
          id: editingId,
          name: formData.name,
          description: formData.description || undefined,
          parentId: formData.parentId || undefined,
          imageUrl,
        });

        if (result.ok && result.category) {
          // Update local state with proper typing
          const updatedCategory: Category = {
            ...result.category,
            _count: {
              products: result.category._count?.products || 0,
              children: 0, // We don't get this from update, keep existing or default to 0
            },
          };
          setCategories(
            categories.map((cat) => (cat.id === editingId ? { ...cat, ...updatedCategory } : cat))
          );
          handleCancelEdit();
          router.refresh();
        } else {
          alert(result.message);
        }
      } else {
        // Create new category
        const result = await createCategory({
          name: formData.name,
          description: formData.description || undefined,
          parentId: formData.parentId || undefined,
          imageUrl,
        });

        if (result.ok && result.category) {
          // Add to local state with proper typing
          const newCategory: Category = {
            ...result.category,
            _count: {
              products: result.category._count?.products || 0,
              children: 0,
            },
          };
          setCategories([...categories, newCategory]);
          handleCancelEdit();
          router.refresh();
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al guardar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      imageFile: null,
    });
    const mainImage = category.media.find((m) => m.isMain);
    setImagePreview(mainImage?.url || null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', parentId: '', imageFile: null });
    setImagePreview(null);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    const result = await deleteCategory(categoryId);
    if (result.ok) {
      // Remove from local state
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <TabsNavigation tabs={tabs} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Categories List */}
        <div className="xl:col-span-2">
          <CategoryFilters
            searchTerm={searchTerm}
            filterParent={filterParent}
            isDark={isDark}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterParent}
          />

          <CategoryList
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDark={isDark}
          />
        </div>

        {/* Form Panel */}
        <div className="xl:col-span-1">
          <CategoryForm
            formData={formData}
            editingId={editingId}
            imagePreview={imagePreview}
            isSubmitting={isSubmitting}
            categories={categories}
            isDark={isDark}
            onFormChange={handleFormChange}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}
