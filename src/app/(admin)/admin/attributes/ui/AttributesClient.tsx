'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  createVariantOption,
  updateVariantOption,
  deleteVariantOption,
  createGlobalValue,
  deleteGlobalValue,
} from '@/actions';
import { OptionType } from '@prisma/client';
import { VariantOptionForm } from './VariantOptionForm';
import { VariantOptionsList } from './VariantOptionsList';
import { GlobalValuesPanel } from './GlobalValuesPanel';

interface GlobalValue {
  id: string;
  value: string;
  label: string | null;
  colorHex: string | null;
  imageUrl: string | null;
  order: number;
}

interface VariantOption {
  id: string;
  name: string;
  slug: string;
  type: OptionType;
  description: string | null;
  placeholder: string | null;
  position: number;
  isRequired: boolean;
  isFilterable: boolean;
  globalValues: GlobalValue[];
  _count: {
    productOptions: number;
    variantValues: number;
    globalValues: number;
  };
}

interface Props {
  initialOptions: VariantOption[];
}

export function AttributesClient({ initialOptions }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState<VariantOption[]>(initialOptions);
  const [selectedOption, setSelectedOption] = useState<VariantOption | null>(
    initialOptions[0] || null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionType, setNewOptionType] = useState<OptionType>('TEXT');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for adding global values
  const [newValue, setNewValue] = useState('');
  const [newColorHex, setNewColorHex] = useState('#3B82F6');
  const [isAddingValue, setIsAddingValue] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />;
  }

  const isDark = theme === 'dark';

  const handleAddOption = async () => {
    if (!newOptionName.trim()) return;

    setIsSubmitting(true);
    try {
      // Si está editando, actualizar en lugar de crear
      if (editingOptionId) {
        const result = await updateVariantOption({
          id: editingOptionId,
          name: newOptionName,
          type: newOptionType,
        });

        if (result.ok && result.option) {
          // Actualizar en la lista local
          setOptions(options.map((opt) => (opt.id === editingOptionId ? result.option! : opt)));
          // Si era la opción seleccionada, actualizarla también
          if (selectedOption?.id === editingOptionId) {
            setSelectedOption(result.option);
          }
          setNewOptionName('');
          setNewOptionType('TEXT');
          setEditingOptionId(null);
          setIsSubmitting(false);
          router.refresh();
          return;
        } else {
          alert(result.message);
          setIsSubmitting(false);
          return;
        }
      }
      console.log('Creating variant option:', { name: newOptionName, type: newOptionType });
      const result = await createVariantOption({
        name: newOptionName,
        type: newOptionType,
      });

      console.log('Create variant option result:', result);

      if (result.ok && result.option) {
        // Add new option to local state
        const newOption: VariantOption = {
          ...result.option,
          globalValues: [],
          _count: {
            productOptions: 0,
            variantValues: 0,
            globalValues: 0,
          },
        };
        setOptions([...options, newOption]);
        setSelectedOption(newOption);
        setNewOptionName('');
        setNewOptionType('TEXT');
        router.refresh();
      } else {
        console.error('Failed to create option:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating option:', error);
      alert(
        'Error al crear la opción: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta opción de variante?')) return;

    const result = await deleteVariantOption(optionId);
    if (result.ok) {
      // Remove from local state
      setOptions(options.filter((opt) => opt.id !== optionId));
      if (selectedOption?.id === optionId) {
        setSelectedOption(options[0] || null);
      }
      router.refresh();
    } else {
      alert(result.message);
    }
  };
  const handleEditOption = (option: VariantOption) => {
    setNewOptionName(option.name);
    setNewOptionType(option.type);
    setEditingOptionId(option.id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewOptionName('');
    setNewOptionType('TEXT');
    setEditingOptionId(null);
  };

  const handleAddValue = async () => {
    if (!selectedOption || !newValue.trim()) return;

    setIsAddingValue(true);
    try {
      console.log('Creating global value:', {
        optionId: selectedOption.id,
        value: newValue,
        colorHex: selectedOption.type === 'COLOR' ? newColorHex : undefined,
      });

      const result = await createGlobalValue({
        optionId: selectedOption.id,
        value: newValue,
        colorHex: selectedOption.type === 'COLOR' ? newColorHex : undefined,
      });

      console.log('Create global value result:', result);

      if (result.ok && result.value) {
        // Update local state with new value
        const updatedOptions = options.map((opt) => {
          if (opt.id === selectedOption.id) {
            return {
              ...opt,
              globalValues: [...opt.globalValues, result.value],
              _count: {
                ...opt._count,
                globalValues: opt._count.globalValues + 1,
              },
            };
          }
          return opt;
        });
        setOptions(updatedOptions);
        const updatedSelected = updatedOptions.find((opt) => opt.id === selectedOption.id);
        if (updatedSelected) {
          setSelectedOption(updatedSelected);
        }
        setNewValue('');
        setNewColorHex('#3B82F6');
        router.refresh();
      } else {
        console.error('Failed to create value:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating value:', error);
      alert('Error al crear el valor: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsAddingValue(false);
    }
  };

  const handleDeleteValue = async (valueId: string) => {
    if (!confirm('¿Estás seguro de eliminar este valor?')) return;

    const result = await deleteGlobalValue(valueId);
    if (result.ok && selectedOption) {
      // Update local state by removing the value
      const updatedOptions = options.map((opt) => {
        if (opt.id === selectedOption.id) {
          return {
            ...opt,
            globalValues: opt.globalValues.filter((v) => v.id !== valueId),
            _count: {
              ...opt._count,
              globalValues: opt._count.globalValues - 1,
            },
          };
        }
        return opt;
      });
      setOptions(updatedOptions);
      const updatedSelected = updatedOptions.find((opt) => opt.id === selectedOption.id);
      if (updatedSelected) {
        setSelectedOption(updatedSelected);
      }
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Variant Options */}
      <div className="lg:col-span-1">
        <VariantOptionForm
          newOptionName={newOptionName}
          newOptionType={newOptionType}
          editingId={editingOptionId}
          isSubmitting={isSubmitting}
          isDark={isDark}
          onNameChange={setNewOptionName}
          onTypeChange={setNewOptionType}
          onSubmit={handleAddOption}
          onCancel={handleCancelEdit}
        />

        <VariantOptionsList
          options={options}
          selectedOptionId={selectedOption?.id || null}
          searchTerm={searchTerm}
          isDark={isDark}
          onSearch={setSearchTerm}
          onSelectOption={setSelectedOption}
          onEditOption={handleEditOption}
          onDeleteOption={handleDeleteOption}
        />
      </div>

      {/* Right Column - Global Values */}
      <div className="lg:col-span-2">
        {selectedOption && selectedOption.type !== 'TEXT' && selectedOption.type !== 'NUMBER' ? (
          <GlobalValuesPanel
            selectedOption={selectedOption}
            newValue={newValue}
            newColorHex={newColorHex}
            isAddingValue={isAddingValue}
            isDark={isDark}
            onValueChange={setNewValue}
            onColorChange={setNewColorHex}
            onAddValue={handleAddValue}
            onDeleteValue={handleDeleteValue}
          />
        ) : selectedOption ? (
          <div
            className={`p-8 rounded-lg border-2 border-dashed ${
              isDark
                ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-600'
            }`}
          >
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Entrada de texto libre</p>
              <p className="text-sm">
                Los atributos de tipo{' '}
                <strong>{selectedOption.type === 'TEXT' ? 'Texto' : 'Número'}</strong> permiten
                entrada libre.
                <br />
                No necesitas definir valores predeterminados.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`p-8 rounded-lg border-2 border-dashed ${
              isDark
                ? 'bg-gray-800/50 border-gray-700 text-gray-500'
                : 'bg-gray-50 border-gray-300 text-gray-400'
            }`}
          >
            <p className="text-center">
              Selecciona una opción de la izquierda para gestionar sus valores
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
