import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, UploadCloud, Tag, Layers, ArrowLeft, Plus, Trash2, 
  Edit2, X, CheckCircle2, ArrowDownToLine, Settings, 
  Image as ImageIcon, Palette, Filter, CheckSquare, Zap, Percent,
  Layout, HelpCircle, ChevronRight, AlertTriangle, SlidersHorizontal,
  ListFilter, Copy, Wand2, MousePointerClick, RefreshCcw, FolderTree, 
  Search, Briefcase, ChevronDown, Check, Youtube, Star, PlayCircle, Link,
  FileText, Rocket, Package, Truck, ArrowUpRight, ArrowRightLeft
} from 'lucide-react';

// --- MOCK DATABASE ---
const INITIAL_GLOBAL_ATTRIBUTES = [
  { id: 'attr_1', name: 'Talla', type: 'select', values: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 'attr_2', name: 'Color', type: 'color', values: ['Rojo', 'Azul', 'Negro', 'Blanco'] },
  { id: 'attr_3', name: 'Material', type: 'select', values: ['Algodón', 'Poliéster', 'Seda'] },
];

const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: 'Ropa', parentId: null },
  { id: 'cat_2', name: 'Camisetas', parentId: 'cat_1' }, 
  { id: 'cat_3', name: 'Pantalones', parentId: 'cat_1' },
  { id: 'cat_4', name: 'Tecnología', parentId: null },
  { id: 'cat_5', name: 'Accesorios', parentId: 'cat_4' }, 
  { id: 'cat_6', name: 'Ofertas', parentId: null }
];

const INITIAL_BRANDS = [
  { id: 'brand_1', name: 'Nike' },
  { id: 'brand_2', name: 'Adidas' },
  { id: 'brand_3', name: 'Apple' },
  { id: 'brand_4', name: 'Samsung' }
];

// Mock de otros productos para "Relacionados"
const OTHER_PRODUCTS = [
  { id: 'prod_1', name: 'Zapatillas Running', price: 120 },
  { id: 'prod_2', name: 'Calcetines Deportivos', price: 15 },
  { id: 'prod_3', name: 'Gorra Urbana', price: 25 },
  { id: 'prod_4', name: 'Mochila Táctica', price: 80 },
];

// --- HELPERS ---
const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- COMPONENTES UI AUXILIARES ---

const Card = ({ children, title, action, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {(title) && (
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-wrap gap-2 justify-between items-center rounded-t-xl bg-white relative z-20"> 
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {action && <div className="ml-auto">{action}</div>}
      </div>
    )}
    <div className="p-4 sm:p-6 relative z-10">
      {children}
    </div>
  </div>
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
    {children}
  </label>
);

const Input = ({ className = "", suffix, prefix, ...props }) => (
  <div className="relative">
    {prefix && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{prefix}</div>}
    <input
      className={`block w-full rounded-lg border-slate-300 bg-slate-50 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm py-2.5 px-3 
      ${suffix ? 'pr-10' : ''} ${prefix ? 'pl-9' : ''} ${className}`}
      {...props}
    />
    {suffix && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">{suffix}</div>}
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <div 
    className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
    onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
  >
    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const ProductUpload = () => {
  // --- ESTADOS GENERALES ---
  const [productType, setProductType] = useState('simple'); 
  const [product, setProduct] = useState({ 
    title: '', description: '', 
    price: '', salePrice: '', costPerItem: '', 
    sku: '', barcode: '', trackQuantity: true, quantity: 0, 
    status: 'active',
    weight: '', weightUnit: 'kg',
    length: '', width: '', height: '', dimUnit: 'cm'
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // --- ESTADOS RELACIONADOS ---
  const [linkedProducts, setLinkedProducts] = useState({ upsells: [], crossSells: [] });
  const [productSearch, setProductSearch] = useState('');
  const [activeSearchType, setActiveSearchType] = useState(null); // 'upsells' | 'crossSells'

  // --- ESTADOS ORGANIZACIÓN ---
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryParentId, setNewCategoryParentId] = useState('');
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [tags, setTags] = useState([]);
  
  // --- ESTADOS VARIANTES ---
  const [globalAttributes, setGlobalAttributes] = useState(INITIAL_GLOBAL_ATTRIBUTES);
  const [options, setOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState({ image: true, price: true, salePrice: false, sku: true, stock: true });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [bulkValues, setBulkValues] = useState({ price: '', salePrice: '', stock: '' });
  
  // --- MULTIMEDIA ---
  const [mediaItems, setMediaItems] = useState([]); 
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  
  // Filtros
  const [activeFilters, setActiveFilters] = useState({});

  // UI Control
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isValueConfigModalOpen, setIsValueConfigModalOpen] = useState(false);
  const [imagePickerVariantId, setImagePickerVariantId] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [openSelectorId, setOpenSelectorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- MANEJADORES ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => { 
    if (!e.target.files) return; 
    const newItems = Array.from(e.target.files).map((f, index) => ({ 
        id: Math.random().toString(36).substr(2, 9), 
        type: 'image',
        url: URL.createObjectURL(f), 
        name: f.name,
        isMain: mediaItems.length === 0 && index === 0 
    }));
    setMediaItems(prev => [...prev, ...newItems]); 
  };

  const handleAddVideo = () => {
      const videoId = getYoutubeId(videoUrlInput);
      if (!videoId) { setNotification({ type: 'error', message: 'URL inválida' }); setTimeout(() => setNotification(null), 3000); return; }
      setMediaItems(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type: 'video', url: `https://img.youtube.com/vi/${videoId}/0.jpg`, videoLink: videoUrlInput, name: 'Video', isMain: false }]);
      setVideoUrlInput(''); setIsVideoModalOpen(false);
  };

  const setMainMedia = (id) => setMediaItems(prev => prev.map(item => ({ ...item, isMain: item.id === id })));
  const removeMedia = (id) => setMediaItems(prev => { const n = prev.filter(i => i.id !== id); if (prev.find(i => i.id === id)?.isMain && n.length) n[0].isMain = true; return n; });

  // --- RELACIONADOS ---
  const addLinkedProduct = (prod) => {
    setLinkedProducts(prev => ({ ...prev, [activeSearchType]: [...prev[activeSearchType], prod] }));
    setActiveSearchType(null);
  };
  const removeLinkedProduct = (type, id) => {
    setLinkedProducts(prev => ({ ...prev, [type]: prev[type].filter(p => p.id !== id) }));
  };

  // --- LOGICA DE VARIANTES (Omitida por brevedad si no cambió, pero mantenida funcional) ---
  useEffect(() => {
    if (productType === 'simple') return;
    const activeOptions = options.filter(opt => opt.values.length > 0);
    if (activeOptions.length === 0) { if (options.length === 0) setVariants([]); return; }
    
    const combine = (opts, prefix = []) => {
      if (!opts.length) return [prefix];
      const first = opts[0];
      const rest = opts.slice(1);
      let combinations = [];
      (first.values || []).forEach(val => combinations = [...combinations, ...combine(rest, [...prefix, val])]);
      return combinations;
    };
    
    const newVariantsList = combine(activeOptions).map(combo => {
      const name = combo.join(' / ');
      const existing = variants.find(v => v.name === name);
      const attributes = {};
      combo.forEach((val, idx) => { if (activeOptions[idx]) attributes[activeOptions[idx].name] = val; });
      return existing || { id: Math.random().toString(36).substr(2, 9), name, attributes, price: product.price || '', salePrice: '', sku: product.sku ? `${product.sku}-${combo.join('-')}` : '', quantity: 0, imageId: null };
    });
    if (newVariantsList.length !== variants.length || !newVariantsList.every((v, i) => v.name === variants[i]?.name)) setVariants(newVariantsList);
  }, [options, productType]);

  const filteredVariants = variants.filter(v => {
      return Object.entries(activeFilters).every(([key, val]) => {
          if (!val) return true;
          if (v.attributes && v.attributes[key]) return v.attributes[key] === val;
          return v.name.includes(val); 
      });
  });

  // --- SAVE ---
  const handleSave = (targetStatus) => {
    setLoading(true);
    setProduct(prev => ({ ...prev, status: targetStatus }));
    setTimeout(() => {
      setLoading(false); setIsEditing(true);
      const message = targetStatus === 'active' ? (isEditing ? 'Actualizado correctamente' : 'Publicado con éxito') : 'Guardado en borradores';
      setNotification({ type: 'success', message }); setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  // --- HELPERS VARIANTES ---
  const addOptionBlock = () => setOptions(prev => [...prev, { id: Date.now(), attributeId: null, name: '', values: [], metadata: {} }]);
  const removeOptionBlock = (id) => setOptions(prev => prev.filter(o => o.id !== id));
  const selectGlobalAttribute = (optionBlockId, globalAttr) => { setOptions(prev => prev.map(opt => opt.id === optionBlockId ? { ...opt, attributeId: globalAttr.id, name: globalAttr.name, values: [], metadata: {} } : opt)); setOpenSelectorId(null); };
  const createGlobalAttribute = () => { if (!newAttributeName.trim()) return; setGlobalAttributes(prev => [...prev, { id: `attr_${Date.now()}`, name: newAttributeName, type: 'text', values: [] }]); setNewAttributeName(''); setIsAttributeModalOpen(false); };
  const addOptionValue = (optionId, value) => { const v = value.trim(); if (!v) return; setOptions(prev => prev.map(opt => opt.id === optionId && !opt.values.includes(v) ? { ...opt, values: [...opt.values, v] } : opt)); };
  const removeOptionValue = (optionId, vRm) => setOptions(prev => prev.map(opt => { if (opt.id === optionId) { const m = { ...opt.metadata }; delete m[vRm]; return { ...opt, values: opt.values.filter(v => v !== vRm), metadata: m }; } return opt; }));
  const updateVariant = (id, f, v) => setVariants(prev => prev.map(item => item.id === id ? { ...item, [f]: v } : item));
  const removeVariant = (id) => setVariants(prev => prev.filter(v => v.id !== id));
  const assignImageToVariant = (vid, imgId) => { 
      if (vid === 'bulk') {
          if (selectedVariants.size === 0) return;
          setVariants(prev => prev.map(v => selectedVariants.has(v.id) ? { ...v, imageId: imgId } : v));
          setNotification({ type: 'success', message: 'Imagen asignada' }); setTimeout(() => setNotification(null), 3000);
      } else { setVariants(prev => prev.map(v => v.id === vid ? { ...v, imageId: imgId } : v)); }
      setImagePickerVariantId(null); 
  };
  const toggleSelectAll = () => {
      const visibleIds = new Set(filteredVariants.map(v => v.id));
      const allSelected = filteredVariants.length > 0 && filteredVariants.every(v => selectedVariants.has(v.id));
      setSelectedVariants(prev => { const next = new Set(prev); if (allSelected) visibleIds.forEach(id => next.delete(id)); else visibleIds.forEach(id => next.add(id)); return next; });
  };
  const toggleSelectVariant = (id) => setSelectedVariants(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleBulkApply = () => { 
      if (selectedVariants.size === 0) return;
      setVariants(prev => prev.map(v => selectedVariants.has(v.id) ? { ...v, price: bulkValues.price || v.price, salePrice: bulkValues.salePrice || v.salePrice, quantity: bulkValues.stock || v.quantity } : v));
      setNotification({ type: 'success', message: `Actualizadas ${selectedVariants.size} variantes` }); 
      setBulkValues({ price: '', salePrice: '', stock: '' }); setTimeout(() => setNotification(null), 3000); 
  };
  const handleDeleteSelected = () => { if (selectedVariants.size === 0) return; if (!window.confirm(`¿Eliminar selección?`)) return; setVariants(prev => prev.filter(v => !selectedVariants.has(v.id))); setSelectedVariants(new Set()); };
  const openValueConfig = (option, val) => { setEditingValue({ optionId: option.id, valueName: val, meta: option.metadata?.[val] || { type: 'color', value: '#000000' } }); setIsValueConfigModalOpen(true); };
  const toggleFilter = (attrName, value) => { setActiveFilters(prev => { const current = prev[attrName]; return { ...prev, [attrName]: current === value ? null : value }; }); };
  const activeOptionsCount = options.filter(o => o.values.length > 0).length;

  // --- ORGANIZACIÓN ---
  const toggleCategory = (id) => setSelectedCategoryIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleCreateCategory = () => { if(!newCategoryName.trim())return; const id=`c_${Date.now()}`; setCategories(p=>[...p,{id,name:newCategoryName,parentId:newCategoryParentId||null}]); setSelectedCategoryIds(p=>new Set(p).add(id)); setNewCategoryName(''); setIsCreatingCategory(false); };
  const renderCategoryTree = (pid=null, lvl=0) => categories.filter(c=>c.parentId===pid).map(c=><React.Fragment key={c.id}><label className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer"><div style={{paddingLeft:`${lvl*20}px`}} className="flex w-full items-center"><input type="checkbox" className="rounded border-slate-300 text-indigo-600 mr-2" checked={selectedCategoryIds.has(c.id)} onChange={()=>toggleCategory(c.id)}/><span className={selectedCategoryIds.has(c.id)?'text-indigo-700 font-medium':'text-slate-700'}>{c.name}</span></div></label>{renderCategoryTree(c.id,lvl+1)}</React.Fragment>);
  const selectBrand = (b) => { setSelectedBrandId(b.id); setIsBrandMenuOpen(false); setBrandSearch(''); };
  const createBrand = () => { if(!brandSearch.trim())return; const id=`b_${Date.now()}`; setBrands(p=>[...p,{id,name:brandSearch}]); setSelectedBrandId(id); setIsBrandMenuOpen(false); setBrandSearch(''); };
  const addTag = (v) => { if(v.trim() && !tags.includes(v.trim())) setTags(p=>[...p,v.trim()]); };
  const removeTag = (t) => setTags(p=>p.filter(tg=>tg!==t));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 overflow-x-hidden">
      
      {/* MODALES VARIOS */}
      <Modal isOpen={isAttributeModalOpen} onClose={() => setIsAttributeModalOpen(false)} title="Crear Atributo Global">
        <div className="space-y-4"><Input autoFocus placeholder="Ej. Tela" value={newAttributeName} onChange={(e) => setNewAttributeName(e.target.value)} /><button onClick={createGlobalAttribute} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg">Crear</button></div>
      </Modal>
      <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Agregar Video YouTube">
        <div className="space-y-4"><Input autoFocus placeholder="https://youtube.com/..." value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)} suffix={<Youtube size={16}/>} /><button onClick={handleAddVideo} className="w-full py-2.5 bg-red-600 text-white rounded-lg">Agregar</button></div>
      </Modal>
      <Modal isOpen={!!imagePickerVariantId} onClose={() => setImagePickerVariantId(null)} title="Asignar Imagen">
         <div className="grid grid-cols-4 gap-3"><button onClick={()=>assignImageToVariant(imagePickerVariantId,null)} className="aspect-square border rounded flex items-center justify-center text-slate-400"><X/></button>{mediaItems.filter(m=>m.type==='image').map(img=><button key={img.id} onClick={()=>assignImageToVariant(imagePickerVariantId,img.id)} className="aspect-square border rounded overflow-hidden"><img src={img.url} className="w-full h-full object-cover"/></button>)}</div>
      </Modal>
      
      {/* MODAL BUSCAR PRODUCTOS RELACIONADOS */}
      <Modal isOpen={!!activeSearchType} onClose={() => setActiveSearchType(null)} title={activeSearchType === 'upsells' ? "Ventas Dirigidas" : "Ventas Cruzadas"}>
         <div className="space-y-4">
            <div className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input className="w-full pl-9 p-2.5 border rounded-lg" placeholder="Buscar producto..." autoFocus/></div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
               {OTHER_PRODUCTS.map(p => (
                  <button key={p.id} onClick={() => addLinkedProduct(p)} className="w-full flex justify-between p-3 hover:bg-slate-50 rounded-lg text-left">
                     <span className="font-medium text-slate-700">{p.name}</span>
                     <span className="text-slate-500">${p.price}</span>
                  </button>
               ))}
            </div>
         </div>
      </Modal>

      {/* NOTIFICACIÓN */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[70] px-4 py-3 border rounded-lg shadow-lg flex items-center gap-3 animate-bounce ${notification.type==='error'?'bg-red-50 text-red-800 border-red-200':'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
          {notification.type === 'error' ? <AlertTriangle size={20}/> : <CheckCircle2 size={20} />} <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 overflow-hidden">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 flex-shrink-0"><ArrowLeft size={20} /></button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate">{product.title || 'Nuevo Producto'}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="truncate">{product.status === 'active' ? 'Publicado' : 'Borrador'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSave('draft')} disabled={loading} className="hidden sm:flex px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors gap-2 items-center"><FileText size={16}/> Guardar borrador</button>
              <button onClick={() => handleSave('active')} disabled={loading} className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all whitespace-nowrap">
                {loading ? '...' : <>{isEditing ? <Save size={18} /> : <Rocket size={18} />} <span className="hidden sm:inline">{isEditing ? 'Actualizar' : 'Publicar'}</span><span className="sm:hidden">{isEditing ? 'Actualizar' : 'Publicar'}</span></>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          
          <div className="col-span-12 lg:col-span-8 space-y-6 relative z-10">
            <Card title="Información Básica">
              <div className="space-y-4">
                <Input name="title" value={product.title} onChange={handleChange} placeholder="Nombre del Producto" />
                <textarea name="description" rows="3" value={product.description} onChange={handleChange} className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Describe tu producto..." />
              </div>
            </Card>

            <div className="bg-indigo-900 rounded-xl p-1 shadow-inner flex">
              <button onClick={() => setProductType('simple')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${productType === 'simple' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-200 hover:text-white'}`}><Tag size={16} /> Simple</button>
              <button onClick={() => setProductType('variable')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${productType === 'variable' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-200 hover:text-white'}`}><Layers size={16} /> Con Variantes</button>
            </div>

            <Card title="Multimedia" action={<button onClick={() => setIsVideoModalOpen(true)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"><Youtube size={14}/> Agregar Video</button>}>
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-colors cursor-pointer relative text-center">
                  <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Subir imágenes</span>
               </div>
               {mediaItems.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-6">
                    {mediaItems.map((media) => (
                      <div key={media.id} className={`aspect-square rounded-lg overflow-hidden relative border group transition-all ${media.isMain ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}`}>
                        <img src={media.url} alt="" className="w-full h-full object-cover" />
                        {media.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><PlayCircle size={32} className="text-white"/></div>}
                        {media.isMain && <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-br font-bold z-10">PORTADA</div>}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                           <div className="flex justify-end"><button onClick={() => removeMedia(media.id)} className="p-1 bg-white text-red-500 rounded-full hover:bg-red-50"><Trash2 size={14}/></button></div>
                           {!media.isMain && <button onClick={() => setMainMedia(media.id)} className="w-full py-1 bg-white/90 text-indigo-700 text-xs font-bold rounded flex items-center justify-center gap-1"><Star size={12} fill="currentColor" /> Portada</button>}
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </Card>

            {/* --- BLOQUE ESPECÍFICO PARA PRODUCTO SIMPLE --- */}
            {productType === 'simple' && (
               <Card title="Precios e Inventario">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <Label>Precio Normal</Label>
                        <Input type="number" prefix="$" placeholder="0.00" name="price" value={product.price} onChange={handleChange} />
                     </div>
                     <div>
                        <Label>Precio Oferta</Label>
                        <Input type="number" prefix="$" placeholder="0.00" name="salePrice" value={product.salePrice} onChange={handleChange} />
                     </div>
                     <div>
                        <Label>Costo por artículo</Label>
                        <Input type="number" prefix="$" placeholder="0.00" name="costPerItem" value={product.costPerItem} onChange={handleChange} />
                        <p className="text-xs text-slate-400 mt-1">Para calcular márgenes de ganancia.</p>
                     </div>
                     
                     <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                           <Label>Gestión de Inventario</Label>
                           <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">{product.trackQuantity ? 'Gestionar stock' : 'No gestionar'}</span>
                              <ToggleSwitch checked={product.trackQuantity} onChange={(checked) => setProduct(p => ({...p, trackQuantity: checked}))} />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <Label>SKU (Referencia)</Label>
                              <Input placeholder="Ej. CAM-001" name="sku" value={product.sku} onChange={handleChange} />
                           </div>
                           {product.trackQuantity && (
                              <div>
                                 <Label>Cantidad Disponible</Label>
                                 <Input type="number" placeholder="0" name="quantity" value={product.quantity} onChange={handleChange} />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </Card>
            )}

            

            {/* --- BLOQUE VARIANTES (Solo Variable) --- */}
            {productType === 'variable' && (
              <div className="space-y-6">
                
                <div>
                  <Card title="Atributos" action={<button onClick={addOptionBlock} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"><Plus size={16}/> Agregar</button>}>
                    <div className="space-y-6">
                      {options.length === 0 && <div className="text-center py-4 text-slate-400 text-sm">Agrega atributos (Talla, Color) para generar variantes.</div>}
                      {options.map((option) => (
                        <div key={option.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                          <button onClick={() => removeOptionBlock(option.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                          <div className="mb-4">
                            <Label>Atributo Global</Label>
                            <div className="relative z-20"> 
                              <div onClick={() => setOpenSelectorId(openSelectorId === option.id ? null : option.id)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:border-indigo-400">
                                <span className={option.name ? 'text-slate-900 font-medium' : 'text-slate-400'}>{option.name || 'Selecciona...'}</span>
                                <Settings size={14} className="text-slate-400"/>
                              </div>
                              {openSelectorId === option.id && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto w-[90vw] sm:w-auto min-w-[200px]">
                                  {globalAttributes.map(attr => (
                                    <button key={attr.id} onClick={() => selectGlobalAttribute(option.id, attr)} className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 text-slate-700 flex justify-between">
                                      {attr.name}
                                      {option.attributeId === attr.id && <CheckCircle2 size={14} className="text-indigo-600"/>}
                                    </button>
                                  ))}
                                  <button onClick={() => setIsAttributeModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-indigo-600 font-medium border-t border-slate-100">+ Crear nuevo</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={!option.attributeId ? 'opacity-50 pointer-events-none' : ''}>
                            <Label>Valores</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {option.values.map(val => (
                                <button key={val} onClick={() => openValueConfig(option, val)} className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-300 text-slate-700 shadow-sm hover:border-indigo-400 transition-colors">
                                   <span className="w-3 h-3 rounded-full border border-slate-200" style={{background: option.metadata?.[val]?.type==='color'?option.metadata?.[val]?.value:'#eee'}}/>
                                   {val} <span onClick={(e) => { e.stopPropagation(); removeOptionValue(option.id, val); }} className="ml-1 hover:text-red-600 cursor-pointer"><X size={12}/></span>
                                </button>
                              ))}
                            </div>
                            
                            <Input 
                                placeholder="Escribe y presiona enter..." 
                                onKeyDown={(e) => { 
                                    if (e.key === 'Enter' || e.keyCode === 13) { 
                                        e.preventDefault(); 
                                        addOptionValue(option.id, e.target.value); 
                                        e.target.value = ''; 
                                    }
                                }} 
                                onChange={(e) => { 
                                    if (e.target.value.includes(',')) { 
                                        e.target.value.split(',').forEach(p => {
                                            if (p.trim()) addOptionValue(option.id, p);
                                        }); 
                                        e.target.value = ''; 
                                    } 
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.trim()) {
                                        addOptionValue(option.id, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {variants.length > 0 && (
                  <Card 
                    title={
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                        <div className="flex items-center gap-2">
                          <span>Variantes ({variants.length})</span>
                          {Object.values(activeFilters).some(Boolean) && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Filter size={10} /> {filteredVariants.length} filtrados
                            </span>
                          )}
                        </div>
                        <div className="relative z-40 flex gap-2 w-full sm:w-auto">
                           <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-medium border ${isFilterOpen || Object.values(activeFilters).some(Boolean) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <ListFilter size={14} /> <span>Filtros</span>
                          </button>
                          <button onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-medium border ${isColumnMenuOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <SlidersHorizontal size={14} /> <span>Columnas</span>
                          </button>
                          
                          {isColumnMenuOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsColumnMenuOpen(false)}></div>
                              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95">
                                <div className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Mostrar</div>
                                <div className="space-y-1">
                                  {[{ id: 'image', label: 'Imagen', icon: ImageIcon }, { id: 'price', label: 'Precio', icon: Zap }, { id: 'salePrice', label: 'Oferta', icon: Percent }, { id: 'sku', label: 'SKU', icon: Tag }, { id: 'stock', label: 'Stock', icon: Layers }].map(col => (
                                    <div key={col.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer" onClick={() => setVisibleColumns(prev => ({ ...prev, [col.id]: !prev[col.id] }))}>
                                      <div className="flex items-center gap-2 text-slate-700 text-sm"><col.icon size={16} className="text-slate-400"/>{col.label}</div>
                                      <ToggleSwitch checked={visibleColumns[col.id]} onChange={() => setVisibleColumns(prev => ({ ...prev, [col.id]: !prev[col.id] }))} />
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
                     {/* 1. FILTROS UNIFICADOS (Chips en una fila) */}
                     {activeOptionsCount > 0 && (
                        <div className="mb-4 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
                           <div className="flex gap-2 min-w-max px-1">
                              {Object.values(activeFilters).some(Boolean) && (
                                <button 
                                  onClick={() => setActiveFilters({})}
                                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center gap-1 transition-colors border border-slate-200"
                                >
                                  <RefreshCcw size={12} />
                                </button>
                              )}
                              
                              {options.flatMap(opt => opt.values.map(val => ({ optName: opt.name, val }))).map(({optName, val}, idx) => {
                                 const isActive = activeFilters[optName] === val;
                                 return (
                                    <button 
                                       key={`${optName}-${val}-${idx}`}
                                       onClick={() => toggleFilter(optName, val)}
                                       className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all flex-shrink-0 flex items-center gap-1
                                       ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                                    >
                                       {val}
                                       {isActive && <CheckCircle2 size={10} className="ml-1"/>}
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                     )}

                     {/* 2. BARRA DE ACCIONES MASIVAS */}
                     {selectedVariants.size > 0 && (
                        <div className="mb-4 p-3 rounded-lg border flex flex-wrap items-center gap-2 bg-indigo-50/50 border-indigo-200 shadow-sm animate-in slide-in-from-top-2">
                           <div className="flex items-center gap-2 text-sm font-medium border-r border-indigo-200/50 pr-3 mr-1 text-indigo-900">
                              <CheckSquare size={16} className="text-indigo-600" /> 
                              <span>{selectedVariants.size}</span>
                           </div>
                           <div className="relative flex items-center">
                              <span className="absolute left-2 text-slate-400 text-xs">$</span>
                              <input type="number" placeholder="Precio" className="pl-4 pr-2 py-1.5 text-xs w-20 rounded border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white" value={bulkValues.price} onChange={(e) => setBulkValues(p => ({ ...p, price: e.target.value }))}/>
                           </div>
                           <input type="number" placeholder="Stock" className="px-2 py-1.5 text-xs w-16 rounded border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white" value={bulkValues.stock} onChange={(e) => setBulkValues(p => ({ ...p, stock: e.target.value }))}/>
                           <button onClick={() => setImagePickerVariantId('bulk')} className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600 flex items-center gap-1 text-xs font-medium px-2" title="Imagen Lote"><ImageIcon size={14}/> <span className="hidden sm:inline">Img</span></button>
                           <div className="flex-1"></div>
                           <button onClick={handleBulkApply} className="px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"><MousePointerClick size={14}/> Aplicar</button>
                           <button onClick={handleDeleteSelected} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors ml-1" title="Eliminar seleccionadas"><Trash2 size={16}/></button>
                        </div>
                     )}

                    <div className="-mx-4 sm:mx-0 overflow-x-auto border-y sm:border rounded-none sm:rounded-lg border-slate-200 max-h-[500px] relative">
                      <table className="w-full text-left text-sm text-slate-600 relative min-w-[600px]">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-4 py-3 border-b w-10 text-center bg-slate-50">
                               <input type="checkbox" checked={filteredVariants.length > 0 && filteredVariants.every(v => selectedVariants.has(v.id))} onChange={toggleSelectAll} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                            </th>
                            {visibleColumns.image && <th className="px-4 py-3 border-b w-16 text-center bg-slate-50">Img</th>}
                            <th className="px-4 py-3 border-b bg-slate-50">Variante</th>
                            {visibleColumns.price && <th className="px-4 py-3 border-b w-28 bg-slate-50">Precio</th>}
                            {visibleColumns.salePrice && <th className="px-4 py-3 border-b w-28 text-indigo-600 bg-slate-50">Oferta</th>}
                            {visibleColumns.sku && <th className="px-4 py-3 border-b w-32 bg-slate-50">SKU</th>}
                            {visibleColumns.stock && <th className="px-4 py-3 border-b w-20 bg-slate-50">Stock</th>}
                            <th className="px-4 py-3 border-b w-10 bg-slate-50"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {filteredVariants.length === 0 ? (
                             <tr><td colSpan={10} className="p-8 text-center text-slate-400">No hay variantes que coincidan con los filtros.</td></tr>
                          ) : (
                             filteredVariants.map((v) => (
                              <tr key={v.id} className={selectedVariants.has(v.id) ? 'bg-indigo-50/30' : 'bg-white'}>
                                <td className="px-4 py-2 text-center"><input type="checkbox" checked={selectedVariants.has(v.id)} onChange={() => toggleSelectVariant(v.id)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/></td>
                                {visibleColumns.image && <td className="px-4 py-2 text-center"><button onClick={() => setImagePickerVariantId(v.id)} className="w-10 h-10 rounded border bg-white flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all">{v.imageId ? <img src={mediaItems.find(i=>i.id===v.imageId)?.url} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-slate-300"/>}</button></td>}
                                <td className="px-4 py-3 font-medium whitespace-nowrap">
                                    {v.name}
                                    {Object.values(activeFilters).some(Boolean) && (
                                       <div className="flex gap-1 mt-1">
                                          {v.name.split(' / ').map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{t}</span>)}
                                       </div>
                                    )}
                                </td>
                                {visibleColumns.price && <td className="px-4 py-2"><Input value={v.price} onChange={(e)=>updateVariant(v.id,'price',e.target.value)} className="min-w-[80px]"/></td>}
                                {visibleColumns.salePrice && <td className="px-4 py-2"><Input value={v.salePrice} onChange={(e)=>updateVariant(v.id,'salePrice',e.target.value)} className="bg-indigo-50/30 text-indigo-700 min-w-[80px]"/></td>}
                                {visibleColumns.sku && <td className="px-4 py-2"><Input value={v.sku} onChange={(e)=>updateVariant(v.id,'sku',e.target.value)} className="min-w-[100px]"/></td>}
                                {visibleColumns.stock && <td className="px-4 py-2"><Input value={v.quantity} onChange={(e)=>updateVariant(v.id,'quantity',e.target.value)} className="min-w-[60px]"/></td>}
                                <td className="px-4 py-2"><button onClick={() => removeVariant(v.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
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
          </div>
          
           {/* COLUMNA DERECHA: ORGANIZACIÓN */}
           <div className="col-span-12 lg:col-span-4 space-y-6 relative z-0">
            <Card title="Organización">
               <div className="space-y-5">
                  <div className="relative">
                    <Label>Categorías</Label>
                    <div className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:border-indigo-400" onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}>
                      <span className={selectedCategoryIds.size > 0 ? 'text-slate-900 font-medium' : 'text-slate-400'}>{selectedCategoryIds.size > 0 ? `${selectedCategoryIds.size} seleccionada${selectedCategoryIds.size > 1 ? 's' : ''}` : 'Seleccionar categorías...'}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}/>
                    </div>
                    {isCategoryMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsCategoryMenuOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in-95">
                          {!isCreatingCategory ? (
                             <div onClick={() => setIsCreatingCategory(true)} className="p-3 border-b border-slate-100 flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 cursor-pointer text-sm font-medium transition-colors"><Plus size={16} /> Crear nueva categoría</div>
                          ) : (
                             <div className="p-3 border-b border-slate-100 bg-slate-50 space-y-2">
                                <input autoFocus className="w-full text-sm border-slate-300 rounded px-2 py-1.5 focus:ring-indigo-500" placeholder="Nombre de categoría" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
                                <select className="w-full text-sm border-slate-300 rounded px-2 py-1.5 text-slate-600" value={newCategoryParentId} onChange={(e) => setNewCategoryParentId(e.target.value)}><option value="">-- Sin categoría padre --</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                                <div className="flex justify-end gap-2 pt-1"><button onClick={() => setIsCreatingCategory(false)} className="text-xs text-slate-500 hover:text-slate-800 px-2">Cancelar</button><button onClick={handleCreateCategory} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Guardar</button></div>
                             </div>
                          )}
                          <div className="max-h-60 overflow-y-auto py-1">{renderCategoryTree()}</div>
                        </div>
                      </>
                    )}
                    {selectedCategoryIds.size > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {categories.filter(c => selectedCategoryIds.has(c.id)).map(c => (
                          <span key={c.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">{c.name}<button onClick={() => toggleCategory(c.id)} className="ml-1 hover:text-indigo-900"><X size={12}/></button></span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label>Marca</Label>
                    <div className="relative">
                        <div className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:border-indigo-400" onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}>
                           <span className={selectedBrandId ? 'text-slate-900' : 'text-slate-400'}>{brands.find(b => b.id === selectedBrandId)?.name || 'Seleccionar marca...'}</span><Briefcase size={14} className="text-slate-400"/>
                        </div>
                        {isBrandMenuOpen && (
                           <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsBrandMenuOpen(false)}></div>
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in-95">
                                 <div className="p-2 border-b border-slate-100"><div className="relative"><Search size={14} className="absolute left-2 top-2 text-slate-400"/><input autoFocus className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Buscar marca..." value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}/></div></div>
                                 <div className="max-h-48 overflow-y-auto">
                                    {filteredBrands.map(brand => (
                                       <button key={brand.id} onClick={() => selectBrand(brand)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex justify-between items-center text-slate-700">{brand.name}{selectedBrandId === brand.id && <Check size={14} className="text-indigo-600"/>}</button>
                                    ))}
                                    {filteredBrands.length === 0 && brandSearch.trim() && (
                                       <button onClick={createBrand} className="w-full text-left px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 flex items-center gap-2"><Plus size={14}/> Crear "{brandSearch}"</button>
                                    )}
                                 </div>
                              </div>
                           </>
                        )}
                    </div>
                  </div>

                  <div>
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-300 text-slate-700 shadow-sm">{tag}<button onClick={() => removeTag(tag)} className="ml-1.5 text-slate-400 hover:text-red-500"><X size={12}/></button></span>
                      ))}
                    </div>
                    <Input placeholder="Ej. Verano, Oferta (Enter o coma)" onKeyDown={(e) => { if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); addTag(e.target.value); e.target.value = ''; } }} onChange={(e) => { if (e.target.value.includes(',')) { e.target.value.split(',').forEach(t => addTag(t)); e.target.value = ''; } }} onBlur={(e) => { if (e.target.value.trim()) { addTag(e.target.value); e.target.value = ''; } }} suffix={<Tag size={14}/>}/>
                  </div>
               </div>
            </Card>

            {/* --- BLOQUE ENVÍO (Global) --- */}
            <Card title="Envíos y Entregas">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Package size={20}/></div>
                  <div className="flex-1 space-y-4">
                     <p className="text-sm text-slate-500">Configura el peso y dimensiones para calcular tarifas de envío.</p>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <Label>Peso</Label>
                           <div className="flex">
                              <input className="block w-full rounded-l-lg border-slate-300 bg-slate-50 border-r-0 focus:ring-indigo-500 text-sm py-2.5 px-3" placeholder="0.0" name="weight" value={product.weight} onChange={handleChange} type="number"/>
                              <select className="bg-slate-100 border border-slate-300 rounded-r-lg text-sm px-2 text-slate-600 focus:outline-none" name="weightUnit" value={product.weightUnit} onChange={handleChange}>
                                 <option value="kg">kg</option><option value="lb">lb</option><option value="oz">oz</option><option value="g">g</option>
                              </select>
                           </div>
                        </div>
                        <div className="sm:col-span-2">
                           <Label>Dimensiones (L x A x A)</Label>
                           <div className="flex gap-2">
                              <Input placeholder="Largo" name="length" value={product.length} onChange={handleChange} />
                              <Input placeholder="Ancho" name="width" value={product.width} onChange={handleChange} />
                              <Input placeholder="Alto" name="height" value={product.height} onChange={handleChange} />
                              <select className="bg-slate-100 border border-slate-300 rounded-lg text-sm px-2 text-slate-600 focus:outline-none" name="dimUnit" value={product.dimUnit} onChange={handleChange}>
                                 <option value="cm">cm</option><option value="in">in</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>

            {/* --- BLOQUE PRODUCTOS RELACIONADOS --- */}
            <Card title="Productos Relacionados">
               <div className="space-y-6">
                  {/* Ventas Dirigidas */}
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                           <ArrowUpRight size={16} className="text-emerald-500"/>
                           <Label>Ventas Dirigidas (Upsells)</Label>
                        </div>
                        <button onClick={() => setActiveSearchType('upsells')} className="text-xs text-indigo-600 font-medium hover:underline">+ Agregar</button>
                     </div>
                     <p className="text-xs text-slate-400 mb-3">Recomienda estos productos en lugar del actual (ej. modelo más caro).</p>
                     
                     {linkedProducts.upsells.length > 0 ? (
                        <div className="space-y-2">
                           {linkedProducts.upsells.map(p => (
                              <div key={p.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded border border-slate-200"></div>
                                    <span className="text-sm font-medium">{p.name}</span>
                                 </div>
                                 <button onClick={() => removeLinkedProduct('upsells', p.id)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                              </div>
                           ))}
                        </div>
                     ) : <div className="p-4 border border-dashed rounded text-center text-xs text-slate-400">Ningún producto seleccionado</div>}
                  </div>

                  <div className="border-t border-slate-100"></div>

                  {/* Ventas Cruzadas */}
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                           <ArrowRightLeft size={16} className="text-blue-500"/>
                           <Label>Ventas Cruzadas (Cross-sells)</Label>
                        </div>
                        <button onClick={() => setActiveSearchType('crossSells')} className="text-xs text-indigo-600 font-medium hover:underline">+ Agregar</button>
                     </div>
                     <p className="text-xs text-slate-400 mb-3">Promociona estos productos complementarios en el carrito (ej. calcetines).</p>
                     
                     {linkedProducts.crossSells.length > 0 ? (
                        <div className="space-y-2">
                           {linkedProducts.crossSells.map(p => (
                              <div key={p.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded border border-slate-200"></div>
                                    <span className="text-sm font-medium">{p.name}</span>
                                 </div>
                                 <button onClick={() => removeLinkedProduct('crossSells', p.id)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                              </div>
                           ))}
                        </div>
                     ) : <div className="p-4 border border-dashed rounded text-center text-xs text-slate-400">Ningún producto seleccionado</div>}
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductUpload;