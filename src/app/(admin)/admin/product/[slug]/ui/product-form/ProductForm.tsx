'use client';
import React, { useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTheme } from 'next-themes';
import {
  Save,
  UploadCloud,
  Tag,
  Layers,
  ArrowLeft,
  Plus,
  Trash2,
  Youtube,
  Star,
  PlayCircle,
  FileText,
  Rocket,
  Package,
  ArrowUpRight,
  ArrowRightLeft,
  Barcode,
  Globe,
  Smartphone,
  Wifi,
  Settings,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  MousePointerClick,
  RefreshCcw,
  Search,
  Briefcase,
  ChevronDown,
  Check,
  Filter,
  ListFilter,
  SlidersHorizontal,
  X,
  Image as ImageIcon,
  Zap,
  Percent,
} from 'lucide-react';

import { useProductForm } from './hooks/useProductForm';
import { Input, Label, Card, RichTextEditor, ToggleSwitch, Modal } from './components/ui';
import type { ProductFormProps } from './product-form.interface';

// YouTube helper
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export function ProductForm({ product, categories, brands, variantOptions }: ProductFormProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { form, errorMessage, isSubmitting, onSubmit, setValue } = useProductForm({
    product,
    categories,
    brands,
    variantOptions,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = form;

  // Product type state
  const [productType, setProductType] = useState('simple');

  // Media state
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Related products state
  const [linkedProducts, setLinkedProducts] = useState<any>({ upsells: [], crossSells: [] });
  const [activeSearchType, setActiveSearchType] = useState<string | null>(null);

  // Organization state
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set<string>());
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Variants state (for variable products)
  const [options, setOptions] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState(new Set<string>());
  const [visibleColumns, setVisibleColumns] = useState({
    image: true,
    price: true,
    salePrice: false,
    sku: true,
    barcode: false,
    stock: true,
  });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [bulkValues, setBulkValues] = useState({ price: '', salePrice: '', stock: '' });
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [imagePickerVariantId, setImagePickerVariantId] = useState<string | null>(null);

  // SEO state
  const [showSeoEdit, setShowSeoEdit] = useState(false);

  // UI state
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-5 sm:px-0">
        <div className="h-96 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  // Watch form values
  const formProduct = watch();
  const trackQuantity = watch('trackQuantity') ?? true;

  // Calculate margin
  const calculateMargin = () => {
    const cost = parseFloat(formProduct.costPerItem?.toString() || '0');
    const sale = parseFloat(formProduct.salePrice || '0');
    const regular = parseFloat(formProduct.price || '0');
    const finalPrice = sale > 0 ? sale : regular;
    if (!cost || !finalPrice) return null;
    const margin = ((finalPrice - cost) / finalPrice) * 100;
    return margin.toFixed(1);
  };
  const marginValue = calculateMargin();

  // Media handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems = Array.from(e.target.files).map((f, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      url: URL.createObjectURL(f),
      name: f.name,
      isMain: mediaItems.length === 0 && index === 0,
    }));
    setMediaItems((prev) => [...prev, ...newItems]);
  };

  const handleAddVideo = () => {
    const videoId = getYoutubeId(videoUrlInput);
    if (!videoId) {
      setNotification({ type: 'error', message: 'URL inválida' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setMediaItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'video',
        url: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        videoLink: videoUrlInput,
        name: 'Video',
        isMain: false,
      },
    ]);
    setVideoUrlInput('');
    setIsVideoModalOpen(false);
  };

  const setMainMedia = (id: string) =>
    setMediaItems((prev) => prev.map((item) => ({ ...item, isMain: item.id === id })));
  const removeMedia = (id: string) =>
    setMediaItems((prev) => {
      const n = prev.filter((i) => i.id !== id);
      if (prev.find((i) => i.id === id)?.isMain && n.length) n[0].isMain = true;
      return n;
    });

  // Organization handlers
  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectBrand = (b: any) => {
    setSelectedBrandId(b.id);
    setIsBrandMenuOpen(false);
    setBrandSearch('');
  };

  const addTag = (v: string) => {
    if (v.trim() && !tags.includes(v.trim())) setTags((p) => [...p, v.trim()]);
  };

  const removeTag = (t: string) => setTags((p) => p.filter((tg) => tg !== t));

  // Save handler
  const handleSave = (targetStatus: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const message = targetStatus === 'active' ? 'Publicado con éxito' : 'Guardado en borradores';
      setNotification({ type: 'success', message });
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`min-h-screen pb-20 font-sans ${
          isDark ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-slate-800'
        }`}
      >
        {/* MODALS */}
        <Modal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title="Agregar Video YouTube"
        >
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="https://youtube.com/..."
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              suffix={<Youtube size={16} />}
            />
            <button
              type="button"
              onClick={handleAddVideo}
              className="w-full py-2.5 bg-red-600 text-white rounded-lg"
            >
              Agregar
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={!!imagePickerVariantId}
          onClose={() => setImagePickerVariantId(null)}
          title="Asignar Imagen"
        >
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setImagePickerVariantId(null)}
              className="aspect-square border rounded flex items-center justify-center text-slate-400"
            >
              <X />
            </button>
            {mediaItems
              .filter((m) => m.type === 'image')
              .map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setImagePickerVariantId(null)}
                  className="aspect-square border rounded overflow-hidden"
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
          </div>
        </Modal>

        {/* NOTIFICATION */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-[70] px-4 py-3 border rounded-lg shadow-lg flex items-center gap-3 animate-bounce ${
              notification.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertTriangle size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* HEADER */}
        <header
          className={`sticky top-0 z-30 backdrop-blur-md border-b ${
            isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className={`hidden sm:flex px-3 py-2 rounded-lg text-sm font-medium transition-colors gap-2 items-center ${
                    isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <FileText size={16} /> Guardar borrador
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  {loading ? (
                    '...'
                  ) : (
                    <>
                      <Rocket size={18} /> <span className="hidden sm:inline">Publicar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* LEFT COLUMN */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Basic Info */}
              <Card title="Información Básica" isDark={isDark}>
                <div className="space-y-4">
                  <Input {...register('title')} placeholder="Nombre del Producto" />
                  <div>
                    <Label helpText="Usa las herramientas de formato para destacar características importantes.">
                      Descripción del Producto
                    </Label>
                    <RichTextEditor
                      value={formProduct.description || ''}
                      onChange={(e) => setValue('description', e.target.value)}
                      placeholder="Describe tu producto detalladamente..."
                    />
                  </div>
                </div>
              </Card>

              {/* Product Type Selector */}
              <div
                className={`rounded-xl p-1 shadow-inner flex overflow-x-auto ${
                  isDark ? 'bg-gray-700' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setProductType('simple')}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                    productType === 'simple'
                      ? isDark
                        ? 'bg-gray-800 text-indigo-400 shadow-md'
                        : 'bg-white text-indigo-900 shadow-md'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-slate-500'
                  }`}
                >
                  <Tag size={16} /> Simple
                </button>
                <button
                  type="button"
                  onClick={() => setProductType('variable')}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                    productType === 'variable'
                      ? isDark
                        ? 'bg-gray-800 text-indigo-400 shadow-md'
                        : 'bg-white text-indigo-900 shadow-md'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-slate-500'
                  }`}
                >
                  <Layers size={16} /> Con Variantes
                </button>
                <button
                  type="button"
                  onClick={() => setProductType('digital')}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                    productType === 'digital'
                      ? isDark
                        ? 'bg-gray-800 text-indigo-400 shadow-md'
                        : 'bg-white text-indigo-900 shadow-md'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-slate-500'
                  }`}
                >
                  <Wifi size={16} /> Digital / Servicio
                </button>
              </div>

              {/* Multimedia */}
              <Card
                title="Multimedia"
                isDark={isDark}
                action={
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded ${
                      isDark
                        ? 'text-indigo-400 hover:text-indigo-300 bg-indigo-900/30'
                        : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50'
                    }`}
                  >
                    <Youtube size={14} /> Agregar Video
                  </button>
                }
              >
                <div
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
                    isDark
                      ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 hover:border-indigo-500'
                      : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-indigo-400'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  <UploadCloud
                    size={32}
                    className={isDark ? 'text-gray-500 mb-2' : 'text-slate-400 mb-2'}
                  />
                  <span
                    className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}
                  >
                    Subir imágenes o arrastrarlas aquí
                  </span>
                </div>
                {mediaItems.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-6">
                    {mediaItems.map((media) => (
                      <div
                        key={media.id}
                        className={`aspect-square rounded-lg overflow-hidden relative border group transition-all ${
                          media.isMain
                            ? 'border-indigo-500 ring-2 ring-indigo-200'
                            : 'border-slate-200'
                        }`}
                      >
                        <img src={media.url} alt="" className="w-full h-full object-cover" />
                        {media.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayCircle size={32} className="text-white" />
                          </div>
                        )}
                        {media.isMain && (
                          <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-br font-bold z-10">
                            PORTADA
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="p-1 bg-white text-red-500 rounded-full hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {!media.isMain && (
                            <button
                              type="button"
                              onClick={() => setMainMedia(media.id)}
                              className="w-full py-1 bg-white/90 text-indigo-700 text-xs font-bold rounded flex items-center justify-center gap-1"
                            >
                              <Star size={12} fill="currentColor" /> Portada
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Pricing & Inventory (for simple/digital) */}
              {(productType === 'simple' || productType === 'digital') && (
                <Card title="Precios e Inventario" isDark={isDark}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label>Precio Normal</Label>
                      <Input type="number" prefix="$" placeholder="0.00" {...register('price')} />
                    </div>
                    <div>
                      <Label helpText="Si llenas este campo, el precio normal aparecerá tachado y este será el precio de venta final.">
                        Precio Oferta
                      </Label>
                      <Input
                        type="number"
                        prefix="$"
                        placeholder="0.00"
                        {...register('salePrice')}
                      />
                    </div>
                    <div>
                      <Label helpText="El costo que tú pagas por el producto. El cliente no lo ve.">
                        Costo por artículo
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          className="flex-1"
                          type="number"
                          prefix="$"
                          placeholder="0.00"
                          {...register('costPerItem')}
                        />
                        {marginValue && (
                          <div
                            className={`flex flex-col justify-center px-3 rounded border text-xs font-semibold ${
                              parseFloat(marginValue) > 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <span>{marginValue}%</span>
                            <span className="text-[10px] font-normal opacity-80">Margen</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <Label helpText="Activa esto si tienes unidades limitadas.">
                          Gestión de Inventario
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            {trackQuantity ? 'Gestionar stock' : 'No gestionar'}
                          </span>
                          <ToggleSwitch
                            checked={trackQuantity}
                            onChange={(checked) => setValue('trackQuantity', checked)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <Label helpText="SKU (Stock Keeping Unit).">SKU (Referencia)</Label>
                          <Input placeholder="Ej. CAM-001" {...register('sku')} />
                        </div>
                        <div>
                          <Label helpText="Código universal (UPC, EAN, ISBN).">
                            Código de Barras
                          </Label>
                          <Input
                            placeholder="ISBN, UPC"
                            {...register('barcode')}
                            suffix={<Barcode size={16} className="text-slate-400" />}
                          />
                        </div>
                        {trackQuantity && (
                          <div>
                            <Label>Cantidad Disponible</Label>
                            <Input type="number" placeholder="0" {...register('quantity')} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Shipping (not for digital) */}
              {productType !== 'digital' && (
                <Card title="Envíos y Entregas" isDark={isDark}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}
                    >
                      <Package size={20} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        Configura el peso y dimensiones para calcular tarifas de envío.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Peso</Label>
                          <div className="flex">
                            <input
                              className={`block w-full rounded-l-lg border-r-0 focus:ring-indigo-500 text-sm py-2.5 px-3 ${
                                isDark
                                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                                  : 'border-slate-300 bg-slate-50'
                              }`}
                              placeholder="0.0"
                              {...register('weight')}
                              type="number"
                            />
                            <select
                              className={`border rounded-r-lg text-sm px-2 focus:outline-none ${
                                isDark
                                  ? 'bg-gray-700 border-gray-600 text-gray-300'
                                  : 'bg-slate-100 border-slate-300 text-slate-600'
                              }`}
                              {...register('weightUnit')}
                            >
                              <option value="kg">kg</option>
                              <option value="lb">lb</option>
                              <option value="oz">oz</option>
                              <option value="g">g</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Dimensiones (L x A x A)</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Largo" {...register('length')} />
                            <Input placeholder="Ancho" {...register('width')} />
                            <Input placeholder="Alto" {...register('height')} />
                            <select
                              className={`border rounded-lg text-sm px-2 focus:outline-none ${
                                isDark
                                  ? 'bg-gray-700 border-gray-600 text-gray-300'
                                  : 'bg-slate-100 border-slate-300 text-slate-600'
                              }`}
                              {...register('dimUnit')}
                            >
                              <option value="cm">cm</option>
                              <option value="in">in</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Related Products */}
              <Card title="Productos Relacionados" isDark={isDark}>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight size={16} className="text-emerald-500" />
                        <Label helpText="Productos que recomiendas EN LUGAR del actual. Generalmente modelos más caros o completos (Upgrade).">
                          Ventas Dirigidas (Upsells)
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSearchType('upsells')}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        + Agregar
                      </button>
                    </div>
                    {linkedProducts.upsells.length > 0 ? (
                      <div className="space-y-2">
                        {linkedProducts.upsells.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded border border-slate-200"></div>
                              <span className="text-sm font-medium">{p.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setLinkedProducts((prev) => ({
                                  ...prev,
                                  upsells: prev.upsells.filter((prod: any) => prod.id !== p.id),
                                }))
                              }
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed rounded text-center text-xs text-slate-400">
                        Ningún producto seleccionado
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100"></div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft size={16} className="text-blue-500" />
                        <Label helpText="Productos COMPLEMENTARIOS. Cosas que se pueden comprar JUNTO con este producto (ej. Calcetines con Zapatos).">
                          Ventas Cruzadas (Cross-sells)
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSearchType('crossSells')}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        + Agregar
                      </button>
                    </div>
                    {linkedProducts.crossSells.length > 0 ? (
                      <div className="space-y-2">
                        {linkedProducts.crossSells.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded border border-slate-200"></div>
                              <span className="text-sm font-medium">{p.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setLinkedProducts((prev) => ({
                                  ...prev,
                                  crossSells: prev.crossSells.filter(
                                    (prod: any) => prod.id !== p.id
                                  ),
                                }))
                              }
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed rounded text-center text-xs text-slate-400">
                        Ningún producto seleccionado
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Variable Products Section */}
              {productType === 'variable' && (
                <div className="space-y-6">
                  <Card
                    title="Atributos"
                    isDark={isDark}
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          setOptions((prev) => [
                            ...prev,
                            {
                              id: Date.now(),
                              attributeId: null,
                              name: '',
                              values: [],
                              metadata: {},
                            },
                          ])
                        }
                        className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        <Plus size={16} /> Agregar
                      </button>
                    }
                  >
                    <div className="space-y-6">
                      {options.length === 0 && (
                        <div className="text-center py-4 text-slate-400 text-sm">
                          Agrega atributos (Talla, Color) para generar variantes.
                        </div>
                      )}
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOptions((prev) => prev.filter((o) => o.id !== option.id))
                            }
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="mb-4">
                            <Label helpText="Elige una característica base como Talla o Color. Si no existe, puedes crearla.">
                              Atributo Global
                            </Label>
                            <div className="relative z-20">
                              <div className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:border-indigo-400">
                                <span
                                  className={
                                    option.name ? 'text-slate-900 font-medium' : 'text-slate-400'
                                  }
                                >
                                  {option.name || 'Selecciona...'}
                                </span>
                                <Settings size={14} className="text-slate-400" />
                              </div>
                            </div>
                          </div>
                          <div
                            className={!option.attributeId ? 'opacity-50 pointer-events-none' : ''}
                          >
                            <Label helpText="Escribe las variaciones (ej: Rojo, Azul) y presiona Enter.">
                              Valores
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {option.values.map((val: string) => (
                                <button
                                  key={val}
                                  type="button"
                                  className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-300 text-slate-700 shadow-sm hover:border-indigo-400 transition-colors"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full border border-slate-200"
                                    style={{ background: '#eee' }}
                                  />
                                  {val}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOptions((prev) =>
                                        prev.map((opt) => {
                                          if (opt.id === option.id) {
                                            const m = { ...opt.metadata };
                                            delete m[val];
                                            return {
                                              ...opt,
                                              values: opt.values.filter((v) => v !== val),
                                              metadata: m,
                                            };
                                          }
                                          return opt;
                                        })
                                      );
                                    }}
                                    className="ml-1 hover:text-red-600 cursor-pointer"
                                  >
                                    <X size={12} />
                                  </span>
                                </button>
                              ))}
                            </div>
                            <Input
                              placeholder="Escribe y presiona enter..."
                              onKeyDown={(e: any) => {
                                if (e.key === 'Enter' || e.keyCode === 13) {
                                  e.preventDefault();
                                  const v = e.target.value.trim();
                                  if (v) {
                                    setOptions((prev) =>
                                      prev.map((opt) =>
                                        opt.id === option.id && !opt.values.includes(v)
                                          ? { ...opt, values: [...opt.values, v] }
                                          : opt
                                      )
                                    );
                                    e.target.value = '';
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Variants Table */}
                  {variants.length > 0 && (
                    <Card
                      isDark={isDark}
                      title={
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                          <div className="flex items-center gap-2">
                            <span>Variantes ({variants.length})</span>
                          </div>
                          <div className="relative z-40 flex gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-medium border ${
                                isColumnMenuOpen
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <SlidersHorizontal size={14} /> <span>Columnas</span>
                            </button>
                            {isColumnMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setIsColumnMenuOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2">
                                  <div className="text-xs font-bold text-slate-400 uppercase px-3 py-2">
                                    Mostrar
                                  </div>
                                  <div className="space-y-1">
                                    {[
                                      { id: 'image', label: 'Imagen', icon: ImageIcon },
                                      { id: 'price', label: 'Precio', icon: Zap },
                                      { id: 'salePrice', label: 'Oferta', icon: Percent },
                                      { id: 'sku', label: 'SKU', icon: Tag },
                                      { id: 'barcode', label: 'Barra', icon: Barcode },
                                      { id: 'stock', label: 'Stock', icon: Layers },
                                    ].map((col) => (
                                      <div
                                        key={col.id}
                                        className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                                        onClick={() =>
                                          setVisibleColumns((prev) => ({
                                            ...prev,
                                            [col.id]: !prev[col.id],
                                          }))
                                        }
                                      >
                                        <div className="flex items-center gap-2 text-slate-700 text-sm">
                                          <col.icon size={16} className="text-slate-400" />
                                          {col.label}
                                        </div>
                                        <ToggleSwitch
                                          checked={visibleColumns[col.id]}
                                          onChange={() =>
                                            setVisibleColumns((prev) => ({
                                              ...prev,
                                              [col.id]: !prev[col.id],
                                            }))
                                          }
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      }
                    >
                      {selectedVariants.size > 0 && (
                        <div className="mb-4 p-3 rounded-lg border flex flex-wrap items-center gap-2 bg-indigo-50/50 border-indigo-200 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium border-r border-indigo-200/50 pr-3 mr-1 text-indigo-900">
                            <CheckSquare size={16} className="text-indigo-600" />
                            <span>{selectedVariants.size}</span>
                          </div>
                          <div className="relative flex items-center">
                            <span className="absolute left-2 text-slate-400 text-xs">$</span>
                            <input
                              type="number"
                              placeholder="Precio"
                              className="pl-4 pr-2 py-1.5 text-xs w-20 rounded border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                              value={bulkValues.price}
                              onChange={(e) =>
                                setBulkValues((p) => ({ ...p, price: e.target.value }))
                              }
                            />
                          </div>
                          <input
                            type="number"
                            placeholder="Stock"
                            className="px-2 py-1.5 text-xs w-16 rounded border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                            value={bulkValues.stock}
                            onChange={(e) =>
                              setBulkValues((p) => ({ ...p, stock: e.target.value }))
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setImagePickerVariantId('bulk')}
                            className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600 flex items-center gap-1 text-xs font-medium px-2"
                            title="Imagen Lote"
                          >
                            <ImageIcon size={14} /> <span className="hidden sm:inline">Img</span>
                          </button>
                          <div className="flex-1"></div>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedVariants.size === 0) return;
                              setVariants((prev) =>
                                prev.map((v) => {
                                  if (selectedVariants.has(v.id)) {
                                    return {
                                      ...v,
                                      price: bulkValues.price !== '' ? bulkValues.price : v.price,
                                      salePrice:
                                        bulkValues.salePrice !== ''
                                          ? bulkValues.salePrice
                                          : v.salePrice,
                                      quantity:
                                        bulkValues.stock !== '' ? bulkValues.stock : v.quantity,
                                    };
                                  }
                                  return v;
                                })
                              );
                              setNotification({
                                type: 'success',
                                message: `Actualizadas ${selectedVariants.size} variantes`,
                              });
                              setBulkValues({ price: '', salePrice: '', stock: '' });
                              setTimeout(() => setNotification(null), 3000);
                            }}
                            className="px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                          >
                            <MousePointerClick size={14} /> Aplicar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedVariants.size === 0) return;
                              if (!window.confirm(`¿Eliminar selección?`)) return;
                              setVariants((prev) =>
                                prev.filter((v) => !selectedVariants.has(v.id))
                              );
                              setSelectedVariants(new Set());
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors ml-1"
                            title="Eliminar seleccionadas"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <div className="-mx-4 sm:mx-0 overflow-x-auto border-y sm:border rounded-none sm:rounded-lg border-slate-200 max-h-[500px] relative">
                        <table className="w-full text-left text-sm text-slate-600 relative min-w-[600px]">
                          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 sticky top-0 z-10 shadow-sm">
                            <tr>
                              <th className="px-4 py-3 border-b w-10 text-center bg-slate-50">
                                <input
                                  type="checkbox"
                                  checked={
                                    variants.length > 0 &&
                                    variants.every((v) => selectedVariants.has(v.id))
                                  }
                                  onChange={() => {
                                    const allSelected =
                                      variants.length > 0 &&
                                      variants.every((v) => selectedVariants.has(v.id));
                                    setSelectedVariants((prev) => {
                                      const next = new Set(prev);
                                      if (allSelected) {
                                        variants.forEach((v) => next.delete(v.id));
                                      } else {
                                        variants.forEach((v) => next.add(v.id));
                                      }
                                      return next;
                                    });
                                  }}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </th>
                              {visibleColumns.image && (
                                <th className="px-4 py-3 border-b w-16 text-center bg-slate-50">
                                  Img
                                </th>
                              )}
                              <th className="px-4 py-3 border-b bg-slate-50">Variante</th>
                              {visibleColumns.price && (
                                <th className="px-4 py-3 border-b w-28 bg-slate-50">Precio</th>
                              )}
                              {visibleColumns.salePrice && (
                                <th className="px-4 py-3 border-b w-28 text-indigo-600 bg-slate-50">
                                  Oferta
                                </th>
                              )}
                              {visibleColumns.sku && (
                                <th className="px-4 py-3 border-b w-32 bg-slate-50">SKU</th>
                              )}
                              {visibleColumns.barcode && (
                                <th className="px-4 py-3 border-b w-32 bg-slate-50">Barcode</th>
                              )}
                              {visibleColumns.stock && (
                                <th className="px-4 py-3 border-b w-20 bg-slate-50">Stock</th>
                              )}
                              <th className="px-4 py-3 border-b w-10 bg-slate-50"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {variants.length === 0 ? (
                              <tr>
                                <td colSpan={10} className="p-8 text-center text-slate-400">
                                  No hay variantes.
                                </td>
                              </tr>
                            ) : (
                              variants.map((v) => (
                                <tr
                                  key={v.id}
                                  className={
                                    selectedVariants.has(v.id) ? 'bg-indigo-50/30' : 'bg-white'
                                  }
                                >
                                  <td className="px-4 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedVariants.has(v.id)}
                                      onChange={() => {
                                        setSelectedVariants((prev) => {
                                          const n = new Set(prev);
                                          n.has(v.id) ? n.delete(v.id) : n.add(v.id);
                                          return n;
                                        });
                                      }}
                                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                  </td>
                                  {visibleColumns.image && (
                                    <td className="px-4 py-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => setImagePickerVariantId(v.id)}
                                        className="w-10 h-10 rounded border bg-white flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all"
                                      >
                                        {v.imageId ? (
                                          <img
                                            src={mediaItems.find((i) => i.id === v.imageId)?.url}
                                            className="w-full h-full object-cover"
                                            alt=""
                                          />
                                        ) : (
                                          <ImageIcon size={16} className="text-slate-300" />
                                        )}
                                      </button>
                                    </td>
                                  )}
                                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                                    {v.name}
                                  </td>
                                  {visibleColumns.price && (
                                    <td className="px-4 py-2">
                                      <Input
                                        value={v.price}
                                        onChange={(e) =>
                                          setVariants((prev) =>
                                            prev.map((item) =>
                                              item.id === v.id
                                                ? { ...item, price: e.target.value }
                                                : item
                                            )
                                          )
                                        }
                                        className="min-w-[80px]"
                                      />
                                    </td>
                                  )}
                                  {visibleColumns.salePrice && (
                                    <td className="px-4 py-2">
                                      <Input
                                        value={v.salePrice}
                                        onChange={(e) =>
                                          setVariants((prev) =>
                                            prev.map((item) =>
                                              item.id === v.id
                                                ? { ...item, salePrice: e.target.value }
                                                : item
                                            )
                                          )
                                        }
                                        className="bg-indigo-50/30 text-indigo-700 min-w-[80px]"
                                      />
                                    </td>
                                  )}
                                  {visibleColumns.sku && (
                                    <td className="px-4 py-2">
                                      <Input
                                        value={v.sku}
                                        onChange={(e) =>
                                          setVariants((prev) =>
                                            prev.map((item) =>
                                              item.id === v.id
                                                ? { ...item, sku: e.target.value }
                                                : item
                                            )
                                          )
                                        }
                                        className="min-w-[100px]"
                                      />
                                    </td>
                                  )}
                                  {visibleColumns.barcode && (
                                    <td className="px-4 py-2">
                                      <Input
                                        value={v.barcode}
                                        onChange={(e) =>
                                          setVariants((prev) =>
                                            prev.map((item) =>
                                              item.id === v.id
                                                ? { ...item, barcode: e.target.value }
                                                : item
                                            )
                                          )
                                        }
                                        className="min-w-[100px]"
                                      />
                                    </td>
                                  )}
                                  {visibleColumns.stock && (
                                    <td className="px-4 py-2">
                                      <Input
                                        value={v.quantity}
                                        onChange={(e) =>
                                          setVariants((prev) =>
                                            prev.map((item) =>
                                              item.id === v.id
                                                ? { ...item, quantity: e.target.value }
                                                : item
                                            )
                                          )
                                        }
                                        className="min-w-[60px]"
                                      />
                                    </td>
                                  )}
                                  <td className="px-4 py-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setVariants((prev) =>
                                          prev.filter((variant) => variant.id !== v.id)
                                        )
                                      }
                                      className="text-slate-400 hover:text-red-600"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* SEO */}
              <Card
                title="Posicionamiento en Buscadores (SEO)"
                isDark={isDark}
                action={
                  <button
                    type="button"
                    onClick={() => setShowSeoEdit(!showSeoEdit)}
                    className={`text-sm font-medium hover:underline ${
                      isDark ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    {showSeoEdit ? 'Cancelar Personalización' : 'Personalizar'}
                  </button>
                }
              >
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border shadow-sm ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-gray-600' : 'bg-slate-100'
                        }`}
                      >
                        <Globe size={14} className={isDark ? 'text-gray-400' : 'text-slate-500'} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          tutienda.com
                        </span>
                        <span
                          className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
                        >
                          https://tutienda.com/productos/{formProduct.slug || 'producto'}
                        </span>
                      </div>
                    </div>
                    <h3
                      className={`text-xl font-medium hover:underline cursor-pointer truncate ${
                        isDark ? 'text-indigo-400' : 'text-[#1a0dab]'
                      }`}
                    >
                      {formProduct.metaTitle || formProduct.title || 'Título del Producto'}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-[#4d5156]'
                      }`}
                    >
                      {formProduct.metaDescription ||
                        'Descripción del producto que aparecerá en los resultados de búsqueda de Google.'}
                    </p>
                  </div>
                  {showSeoEdit && (
                    <div
                      className={`pt-4 border-t space-y-4 ${
                        isDark ? 'border-gray-700' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label helpText="Este es el enlace azul que aparece en Google.">
                            Título de la página
                          </Label>
                          <span
                            className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
                          >
                            {(formProduct.metaTitle || '').length}/70
                          </span>
                        </div>
                        <Input
                          {...register('metaTitle')}
                          maxLength={70}
                          placeholder={formProduct.title}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label helpText="Resumen breve debajo del título en Google.">
                            Meta Descripción
                          </Label>
                          <span
                            className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
                          >
                            {(formProduct.metaDescription || '').length}/160
                          </span>
                        </div>
                        <textarea
                          className={`block w-full rounded-lg border focus:ring-2 focus:ring-indigo-500 text-sm p-3 ${
                            isDark
                              ? 'border-gray-600 bg-gray-800 text-gray-100'
                              : 'border-slate-300 bg-slate-50'
                          }`}
                          rows={3}
                          {...register('metaDescription')}
                          maxLength={160}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Google Shopping */}
              <Card title="Canales de Venta (Google & Instagram)" isDark={isDark}>
                <div className="relative overflow-hidden">
                  <div
                    className={`absolute inset-0 opacity-10 ${
                      isDark
                        ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900'
                        : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'
                    }`}
                  />
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          isDark
                            ? 'bg-gradient-to-br from-blue-500/20 to-pink-500/20'
                            : 'bg-gradient-to-br from-blue-100 to-pink-100'
                        }`}
                      >
                        <Smartphone
                          size={24}
                          className={isDark ? 'text-blue-400' : 'text-blue-600'}
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-slate-800'}`}
                        >
                          Destacá tus productos gratuitamente
                        </h4>
                        <p
                          className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}
                        >
                          Haz que tus productos aparezcan en Instagram Shopping y Google Shopping.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>MPN (Número de Parte)</Label>
                            <Input {...register('mpn')} placeholder="SKU-12345" />
                          </div>
                          <div>
                            <Label>Rango de Edad</Label>
                            <select
                              className={`w-full rounded-lg border text-sm py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 ${
                                isDark
                                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                                  : 'border-slate-300 bg-slate-50'
                              }`}
                              {...register('ageGroup')}
                            >
                              <option value="">Seleccionar...</option>
                              <option value="newborn">Recién nacido</option>
                              <option value="infant">Bebé</option>
                              <option value="toddler">Niño pequeño</option>
                              <option value="kids">Niños</option>
                              <option value="adult">Adultos</option>
                            </select>
                          </div>
                          <div>
                            <Label>Sexo</Label>
                            <select
                              className={`w-full rounded-lg border text-sm py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 ${
                                isDark
                                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                                  : 'border-slate-300 bg-slate-50'
                              }`}
                              {...register('gender')}
                            >
                              <option value="">Seleccionar...</option>
                              <option value="male">Hombre</option>
                              <option value="female">Mujer</option>
                              <option value="unisex">Unisex</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN - Organization */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Card title="Organización" isDark={isDark}>
                <div className="space-y-5">
                  {/* Categories */}
                  <div className="relative">
                    <Label>Categorías</Label>
                    <div
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer ${
                        isDark
                          ? 'bg-gray-800 border-gray-600 hover:border-indigo-500'
                          : 'bg-white border-slate-300 hover:border-indigo-400'
                      }`}
                      onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    >
                      <span
                        className={
                          selectedCategoryIds.size > 0
                            ? isDark
                              ? 'text-gray-100 font-medium'
                              : 'text-slate-900 font-medium'
                            : isDark
                              ? 'text-gray-500'
                              : 'text-slate-400'
                        }
                      >
                        {selectedCategoryIds.size > 0
                          ? `${selectedCategoryIds.size} seleccionada${selectedCategoryIds.size > 1 ? 's' : ''}`
                          : 'Seleccionar categorías...'}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isDark ? 'text-gray-500' : 'text-slate-400'
                        } ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                    {selectedCategoryIds.size > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {categories
                          .filter((c: any) => selectedCategoryIds.has(c.id))
                          .map((c: any) => (
                            <span
                              key={c.id}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                isDark
                                  ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              }`}
                            >
                              {c.name}
                              <button
                                type="button"
                                onClick={() => toggleCategory(c.id)}
                                className={`ml-1 ${
                                  isDark ? 'hover:text-indigo-200' : 'hover:text-indigo-900'
                                }`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Brand */}
                  <div className="relative">
                    <Label>Marca</Label>
                    <div>
                      <div
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer ${
                          isDark
                            ? 'bg-gray-800 border-gray-600 hover:border-indigo-500'
                            : 'bg-white border-slate-300 hover:border-indigo-400'
                        }`}
                        onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
                      >
                        <span
                          className={
                            selectedBrandId
                              ? isDark
                                ? 'text-gray-100'
                                : 'text-slate-900'
                              : isDark
                                ? 'text-gray-500'
                                : 'text-slate-400'
                          }
                        >
                          {brands?.find((b: any) => b.id === selectedBrandId)?.name ||
                            'Seleccionar marca...'}
                        </span>
                        <Briefcase size={14} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-300 text-slate-700 shadow-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1.5 text-slate-400 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input
                      placeholder="Ej. Verano, Oferta (Enter)"
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      suffix={<Tag size={14} />}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </form>
    </FormProvider>
  );
}
