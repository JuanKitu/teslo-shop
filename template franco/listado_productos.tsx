import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, LayoutGrid, List, Table as TableIcon, 
  Download, Plus, Columns, MoreVertical, ChevronDown, 
  X, Check, Trash2, Copy, Share2, ArrowUpDown, Eye, EyeOff,
  Package, DollarSign, Tag, Layers, ChevronLeft, ChevronRight,
  Settings, MousePointerClick, ArrowDownCircle, Percent,
  RefreshCw, Archive, AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_PRODUCTS = Array.from({ length: 64 }).map((_, i) => ({
  id: `PROD-${1000 + i}`,
  sku: `SKU-${1000 + i}`,
  name: i % 2 === 0 ? `Camiseta Premium Indigo V${i}` : `Auriculares Noise Cancel ${i}`,
  image: `https://placehold.co/100x100/e2e8f0/475569?text=Prod+${i+1}`,
  stock: i % 5 === 0 ? 0 : Math.floor(Math.random() * 150),
  price: (Math.random() * 100 + 10).toFixed(2),
  promoPrice: i % 3 === 0 ? (Math.random() * 80 + 5).toFixed(2) : null,
  category: i % 2 === 0 ? 'Ropa' : 'Electrónica',
  tags: i % 2 === 0 ? ['Verano', 'Casual'] : ['Tech', 'Wireless'],
  brand: i % 2 === 0 ? 'IndigoWear' : 'AudioPro',
  status: i % 5 === 0 ? 'Sin Stock' : 'Publicado',
  visibility: i % 10 === 0 ? 'Oculto' : 'Visible',
  shipping: i % 2 === 0 ? 'Gratis' : 'Pago',
  attributes: i % 2 === 0 ? 'Talle: M, Color: Azul' : 'Color: Negro',
  description: "Una descripción breve del producto que ayuda a entender sus características principales.",
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  sales: Math.floor(Math.random() * 500)
}));

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-500",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100",
    dark: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg border border-slate-700"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'slate' }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

const Drawer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {children}
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
          <Button variant="primary" onClick={onClose}>Aplicar</Button>
        </div>
      </div>
    </div>
  );
};

// --- MODAL PARA ACCIONES MASIVAS ---
const BulkActionModal = ({ isOpen, onClose, actionType, selectedCount, onConfirm }) => {
  if (!isOpen) return null;

  const getActionContent = () => {
    switch(actionType) {
      case 'price':
        return {
          title: 'Actualización Masiva de Precios',
          description: `Estás a punto de modificar el precio de ${selectedCount} productos.`,
          inputs: (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Ajuste</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option>Aumentar por Porcentaje (%)</option>
                  <option>Disminuir por Porcentaje (%)</option>
                  <option>Establecer precio fijo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                <div className="relative">
                  <input type="number" className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej: 15" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
                </div>
              </div>
            </div>
          )
        };
      case 'stock':
        return {
          title: 'Gestión Rápida de Stock',
          description: `Modificar inventario para ${selectedCount} items seleccionados.`,
          inputs: (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acción de Stock</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                 <button className="flex flex-col items-center justify-center p-3 border border-indigo-200 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium">
                    <span>Reponer Stock</span>
                    <span className="text-xs font-normal opacity-70">Sumar cantidad</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-700 text-sm font-medium">
                    <span>Establecer Fijo</span>
                    <span className="text-xs font-normal opacity-70">Sobreescribir</span>
                 </button>
              </div>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Cantidad..." />
            </div>
          )
        };
      case 'delete':
        return {
          title: '¿Eliminar productos?',
          description: <span className="text-red-600">Esta acción es irreversible. Se eliminarán {selectedCount} productos permanentemente.</span>,
          inputs: null,
          confirmColor: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return { title: '', description: '', inputs: null };
    }
  };

  const content = getActionContent();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{content.title}</h3>
        <div className="text-sm text-slate-500 mb-6">{content.description}</div>
        {content.inputs}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <button 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition-colors ${content.confirmColor || 'bg-indigo-600 hover:bg-indigo-700'}`}
            onClick={() => { onConfirm(); onClose(); }}
          >
            Confirmar Acción
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function ProductListingView() {
  // Estados de UI
  const [viewMode, setViewMode] = useState('table'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado de Selección Masiva
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null); // 'price', 'stock', 'delete', etc.

  // Estado de Columnas
  const [columns, setColumns] = useState({
    image: { label: 'Imagen', active: true },
    name: { label: 'Producto', active: true },
    sku: { label: 'SKU', active: true },
    stock: { label: 'Stock', active: true },
    price: { label: 'Precio', active: true },
    promo: { label: 'Oferta', active: false },
    category: { label: 'Categoría', active: true },
    tags: { label: 'Etiquetas', active: false },
    brand: { label: 'Marca', active: false },
    attributes: { label: 'Atributos', active: false },
    description: { label: 'Descripción', active: false },
    created: { label: 'Fecha', active: false },
  });

  // Estado de Ordenamiento
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Paginación
  const [paginationMode, setPaginationMode] = useState('pages'); // 'pages' | 'scroll'
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPageLimit, setScrollPageLimit] = useState(1);

  // Filtros
  const [filters, setFilters] = useState({
    stockStatus: 'all', 
    priceType: 'all', 
    visibility: 'all',
  });

  // Resetear al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
    setScrollPageLimit(1);
    // Opcional: Limpiar selección al filtrar para evitar errores
    // setSelectedIds(new Set()); 
  }, [searchTerm, filters, paginationMode, itemsPerPage]);

  // --- LOGICA DATOS ---
  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.sku.toLowerCase().includes(lower) ||
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    if (filters.stockStatus !== 'all') {
      result = result.filter(p => filters.stockStatus === 'inStock' ? p.stock > 0 : p.stock === 0);
    }
    if (filters.visibility !== 'all') {
      result = result.filter(p => p.visibility.toLowerCase() === filters.visibility);
    }
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (['price', 'stock', 'sales'].includes(sortConfig.key)) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [searchTerm, filters, sortConfig]);

  const displayedProducts = useMemo(() => {
    if (paginationMode === 'pages') {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    } else {
      return filteredProducts.slice(0, scrollPageLimit * itemsPerPage);
    }
  }, [filteredProducts, currentPage, itemsPerPage, paginationMode, scrollPageLimit]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- LOGICA SELECCIÓN ---
  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    // Seleccionar todos los visibles actuales
    const allVisibleIds = displayedProducts.map(p => p.id);
    const allSelected = allVisibleIds.every(id => selectedIds.has(id));
    
    const newSet = new Set(selectedIds);
    if (allSelected) {
      allVisibleIds.forEach(id => newSet.delete(id));
    } else {
      allVisibleIds.forEach(id => newSet.add(id));
    }
    setSelectedIds(newSet);
  };

  const isAllSelected = displayedProducts.length > 0 && displayedProducts.every(p => selectedIds.has(p.id));
  const isIndeterminate = displayedProducts.some(p => selectedIds.has(p.id)) && !isAllSelected;

  // Handlers Paginación
  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));
  const loadMore = () => setScrollPageLimit(prev => prev + 1);
  const toggleColumn = (key) => setColumns(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-32">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Productos</h1>
              <p className="text-sm text-slate-500 mt-0.5">Gestión centralizada de catálogo.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="secondary" icon={Download} className="hidden sm:inline-flex">Exportar</Button>
              <Button variant="primary" icon={Plus} className="w-full sm:w-auto">Nuevo Producto</Button>
            </div>
          </div>

          <div className="pb-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex w-full lg:w-auto gap-2">
              <div className="relative flex-1 lg:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" onClick={() => setIsFilterOpen(true)} icon={Filter}>Filtros</Button>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <div className="relative group shrink-0">
                <select 
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:bg-slate-50"
                  onChange={(e) => setSortConfig({ key: e.target.value.split('-')[0], direction: e.target.value.split('-')[1] })}
                >
                  <option value="createdAt-desc">Más nuevos</option>
                  <option value="sales-desc">Más vendidos</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">A - Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1 shrink-0"></div>
              <Button variant="secondary" icon={Columns} onClick={() => setIsColumnModalOpen(true)} className="shrink-0">Columnas</Button>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><TableIcon size={18} /></button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('compact')} className={`p-1.5 rounded-md transition-all ${viewMode === 'compact' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No se encontraron productos</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Intenta ajustar tus filtros.</p>
            <Button variant="secondary" className="mt-4" onClick={() => {setSearchTerm(''); setFilters({stockStatus:'all', priceType:'all', visibility:'all'})}}>Limpiar</Button>
          </div>
        )}

        {/* --- TABLE VIEW --- */}
        {viewMode === 'table' && filteredProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4" 
                      />
                    </th>
                    {columns.image.active && <th className="p-4 w-20">Img</th>}
                    {columns.sku.active && <th className="p-4">SKU</th>}
                    {columns.name.active && <th className="p-4">Producto</th>}
                    {columns.category.active && <th className="p-4">Categoría</th>}
                    {columns.stock.active && <th className="p-4 text-right">Stock</th>}
                    {columns.price.active && <th className="p-4 text-right">Precio</th>}
                    {columns.promo.active && <th className="p-4 text-right">Oferta</th>}
                    {columns.tags.active && <th className="p-4">Tags</th>}
                    {columns.brand.active && <th className="p-4">Marca</th>}
                    {columns.created.active && <th className="p-4">Fecha</th>}
                    <th className="p-4 text-center w-24 bg-slate-50 sticky right-0 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProducts.map((product) => (
                    <tr key={product.id} className={`transition-colors group ${selectedIds.has(product.id) ? 'bg-indigo-50/50 hover:bg-indigo-50/80' : 'hover:bg-slate-50/80'}`}>
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelection(product.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4" 
                        />
                      </td>
                      {columns.image.active && (
                        <td className="p-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        </td>
                      )}
                      {columns.sku.active && <td className="p-4 text-xs font-mono text-slate-500">{product.sku}</td>}
                      {columns.name.active && (
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{product.name}</div>
                          {columns.description.active && <div className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</div>}
                        </td>
                      )}
                      {columns.category.active && <td className="p-4 text-sm text-slate-600">{product.category}</td>}
                      {columns.stock.active && (
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.stock === 0 ? 'bg-red-50 text-red-700' : product.stock < 10 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {product.stock} un.
                          </span>
                        </td>
                      )}
                      {columns.price.active && <td className="p-4 text-right font-medium text-slate-700">${product.price}</td>}
                      {columns.promo.active && (
                        <td className="p-4 text-right">
                          {product.promoPrice ? <span className="text-indigo-600 font-bold">${product.promoPrice}</span> : <span className="text-slate-300">-</span>}
                        </td>
                      )}
                      {columns.tags.active && (
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {product.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">{t}</span>)}
                          </div>
                        </td>
                      )}
                      {columns.brand.active && <td className="p-4 text-sm text-slate-600">{product.brand}</td>}
                      {columns.created.active && <td className="p-4 text-xs text-slate-500 whitespace-nowrap">{new Date(product.createdAt).toLocaleDateString()}</td>}
                      <td className="p-4 text-center sticky right-0 bg-white group-hover:bg-slate-50/80 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Copy size={16} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- GRID VIEW --- */}
        {viewMode === 'grid' && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedProducts.map(product => (
              <div 
                key={product.id} 
                className={`bg-white rounded-xl border shadow-sm transition-all group flex flex-col relative ${selectedIds.has(product.id) ? 'ring-2 ring-indigo-500 border-transparent shadow-md' : 'border-slate-200 hover:shadow-md hover:border-indigo-200'}`}
                onClick={() => toggleSelection(product.id)}
              >
                {/* Selection Overlay for Grid */}
                <div className="absolute top-3 left-3 z-10">
                   <input 
                      type="checkbox" 
                      checked={selectedIds.has(product.id)}
                      onChange={() => {}} // Handled by parent div click
                      className="rounded-md border-slate-300 w-5 h-5 text-indigo-600 focus:ring-indigo-500 shadow-sm"
                    />
                </div>

                <div className="relative aspect-square bg-slate-100 rounded-t-xl overflow-hidden border-b border-slate-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                      <Badge color="red">Sin Stock</Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-400">{product.sku}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${product.visibility === 'Visible' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {product.visibility === 'Visible' ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
                    <div>
                      {product.promoPrice ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 line-through">${product.price}</span>
                          <span className="text-lg font-bold text-indigo-600">${product.promoPrice}</span>
                        </div>
                      ) : <span className="text-lg font-bold text-slate-900">${product.price}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500"><Package size={14} /><span>{product.stock}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- COMPACT VIEW --- */}
        {viewMode === 'compact' && filteredProducts.length > 0 && (
          <div className="space-y-3 mb-8">
            {displayedProducts.map(product => (
              <div 
                key={product.id} 
                className={`bg-white rounded-lg border shadow-sm p-3 flex items-center gap-4 transition-colors cursor-pointer ${selectedIds.has(product.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300'}`}
                onClick={() => toggleSelection(product.id)}
              >
                <div onClick={(e) => e.stopPropagation()} className="flex items-center pl-2">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelection(product.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                  />
                </div>
                <img src={product.image} className="w-12 h-12 rounded bg-slate-100 object-cover" alt="" />
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-xs text-slate-500 flex gap-2"><span className="font-mono">{product.sku}</span> • <span>{product.category}</span></p>
                  </div>
                  <div className="hidden md:block">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-slate-600">{product.stock} en stock</span>
                     </div>
                  </div>
                  <div className="text-right"><span className="font-bold text-slate-900 text-sm">${product.promoPrice || product.price}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PAGINACIÓN / CONTROLES INFERIORES --- */}
        {filteredProducts.length > 0 && (
          <div className={`fixed bottom-6 left-0 right-0 z-20 flex justify-center px-4 transition-all duration-300 ${selectedIds.size > 0 ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2 pr-4 pl-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-4xl w-full">
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                 <div className="flex bg-slate-100 rounded-lg p-1">
                    <button onClick={() => setPaginationMode('pages')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paginationMode === 'pages' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Páginas</button>
                    <button onClick={() => setPaginationMode('scroll')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paginationMode === 'scroll' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Infinito</button>
                 </div>
                 <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer">
                    <option value={12}>12 items</option>
                    <option value={24}>24 items</option>
                    <option value={48}>48 items</option>
                 </select>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex-1 w-full flex justify-center md:justify-end">
                {paginationMode === 'pages' ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft size={18}/></button>
                    <span className="text-sm font-medium text-slate-700 px-2">Pag {currentPage} / {totalPages}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight size={18}/></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                     <span className="text-xs text-slate-400">{displayedProducts.length} de {filteredProducts.length}</span>
                     {displayedProducts.length < filteredProducts.length && <Button variant="ghost" onClick={loadMore} size="sm" className="text-indigo-600">Cargar más</Button>}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* --- BULK ACTIONS BAR (FLOATING) --- */}
        <div className={`fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 transition-all duration-500 ease-out ${selectedIds.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-2 pl-6 pr-2 flex items-center justify-between gap-6 max-w-3xl w-full border border-slate-700">
             
             <div className="flex items-center gap-4">
               <div className="flex items-center justify-center bg-indigo-500 w-8 h-8 rounded-full font-bold text-sm shadow-inner">
                 {selectedIds.size}
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-slate-100 hidden sm:inline">Seleccionados</span>
                 <button onClick={toggleSelectAll} className="text-xs text-indigo-300 hover:text-white text-left underline decoration-dotted">
                    {isAllSelected ? 'Deseleccionar' : 'Seleccionar todo'}
                 </button>
               </div>
             </div>

             <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                {/* Herramientas de Valor para el Comerciante */}
                <button onClick={() => setBulkAction('price')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group min-w-[60px]">
                   <Percent size={18} className="text-indigo-300 group-hover:text-white" />
                   <span className="text-[10px] font-medium text-slate-300 group-hover:text-white">Precios</span>
                </button>
                <button onClick={() => setBulkAction('stock')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group min-w-[60px]">
                   <RefreshCw size={18} className="text-indigo-300 group-hover:text-white" />
                   <span className="text-[10px] font-medium text-slate-300 group-hover:text-white">Stock</span>
                </button>
                <div className="w-px h-8 bg-slate-700 mx-1"></div>
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group min-w-[60px]">
                   <Eye size={18} className="text-slate-400 group-hover:text-white" />
                   <span className="text-[10px] font-medium text-slate-400 group-hover:text-white">Visibilidad</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group min-w-[60px]">
                   <Archive size={18} className="text-slate-400 group-hover:text-white" />
                   <span className="text-[10px] font-medium text-slate-400 group-hover:text-white">Archivar</span>
                </button>
                <button onClick={() => setBulkAction('delete')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors group min-w-[60px]">
                   <Trash2 size={18} className="text-slate-400 group-hover:text-red-400" />
                   <span className="text-[10px] font-medium text-slate-400 group-hover:text-red-300">Eliminar</span>
                </button>
             </div>

             <button onClick={() => setSelectedIds(new Set())} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
             </button>
          </div>
        </div>

      </main>

      {/* MODALES AUXILIARES */}
      <Drawer title="Filtrar Productos" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
         {/* Filtros previos simplificados para el ejemplo */}
         <p>Contenido de filtros...</p>
      </Drawer>

      <Drawer title="Configurar Columnas" isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)}>
        <div className="space-y-1">
          {Object.entries(columns).map(([key, col]) => (
            <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${col.active ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
              <span className={`text-sm font-medium ${col.active ? 'text-indigo-900' : 'text-slate-700'}`}>{col.label}</span>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${col.active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                {col.active && <Check size={14} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={col.active} onChange={() => toggleColumn(key)}/>
            </label>
          ))}
        </div>
      </Drawer>

      <BulkActionModal 
        isOpen={!!bulkAction} 
        onClose={() => setBulkAction(null)} 
        actionType={bulkAction} 
        selectedCount={selectedIds.size}
        onConfirm={() => {
           // Aquí iría la lógica real de actualización
           console.log(`Ejecutando acción ${bulkAction} en ${selectedIds.size} items`);
           setSelectedIds(new Set()); // Limpiar selección tras acción
        }}
      />

    </div>
  );
}