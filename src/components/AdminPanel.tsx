import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, OrderStatus } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FolderPlus,
  Package,
  Layers,
  LogOut,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Truck
} from 'lucide-react';
import { formatVND, formatDate, getStatusBadge } from '../utils/format';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    logout,
    setActiveTab,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus
  } = useStore();

  const [adminTab, setAdminTab] = useState<'products' | 'categories' | 'orders'>('products');

  // Search in admin table
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modals for Categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete Confirm Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'category';
    id: string;
    title: string;
  } | null>(null);

  // Product Form state
  const [pName, setPName] = useState('');
  const [pCategoryId, setPCategoryId] = useState('');
  const [pPrice, setPPrice] = useState<number>(250000);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(320000);
  const [pStock, setPStock] = useState<number>(30);
  const [pImage, setPImage] = useState('');
  const [pSizes, setPSizes] = useState('S, M, L, XL');
  const [pColors, setPColors] = useState('Trắng, Đen, Xám');
  const [pDescription, setPDescription] = useState('');

  // Category Form state
  const [cName, setCName] = useState('');
  const [cSlug, setCSlug] = useState('');
  const [cDescription, setCDescription] = useState('');

  // Sample clothing images for 1-click select in Add/Edit Product
  const SAMPLE_IMAGES = [
    { label: 'Áo thun trắng', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80' },
    { label: 'Áo Polo', url: 'https://images.unsplash.com/photo-1625910513413-5b879b6fb350?w=700&auto=format&fit=crop&q=80' },
    { label: 'Áo sơ mi Oxford', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80' },
    { label: 'Quần Jean ống suông', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80' },
    { label: 'Áo khoác Blazer', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80' },
    { label: 'Đầm xòe', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&auto=format&fit=crop&q=80' }
  ];

  // Open Add Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPCategoryId(categories[0]?.id || '');
    setPPrice(250000);
    setPOriginalPrice(320000);
    setPStock(30);
    setPImage(SAMPLE_IMAGES[0].url);
    setPSizes('S, M, L, XL');
    setPColors('Trắng, Đen, Xanh');
    setPDescription('Chất liệu vải cao cấp, đường may tỉ mỉ, phom dáng chuẩn thời thượng.');
    setIsProductModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPCategoryId(p.categoryId);
    setPPrice(p.price);
    setPOriginalPrice(p.originalPrice || p.price);
    setPStock(p.stock);
    setPImage(p.image);
    setPSizes(p.sizes.join(', '));
    setPColors(p.colors.join(', '));
    setPDescription(p.description);
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const sizesArr = pSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = pColors.split(',').map(c => c.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: pName.trim(),
        categoryId: pCategoryId || categories[0]?.id,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice) > Number(pPrice) ? Number(pOriginalPrice) : undefined,
        stock: Number(pStock),
        image: pImage.trim() || SAMPLE_IMAGES[0].url,
        sizes: sizesArr.length > 0 ? sizesArr : ['Freesize'],
        colors: colorsArr.length > 0 ? colorsArr : ['Mặc định'],
        description: pDescription.trim()
      });
    } else {
      addProduct({
        name: pName.trim(),
        categoryId: pCategoryId || categories[0]?.id,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice) > Number(pPrice) ? Number(pOriginalPrice) : undefined,
        stock: Number(pStock),
        image: pImage.trim() || SAMPLE_IMAGES[0].url,
        sizes: sizesArr.length > 0 ? sizesArr : ['Freesize'],
        colors: colorsArr.length > 0 ? colorsArr : ['Mặc định'],
        description: pDescription.trim()
      });
    }
    setIsProductModalOpen(false);
  };

  // Open Add Category
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCName('');
    setCSlug('');
    setCDescription('');
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category
  const handleOpenEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCName(c.name);
    setCSlug(c.slug);
    setCDescription(c.description);
    setIsCategoryModalOpen(true);
  };

  // Save Category (Add or Edit)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    const slug = cSlug.trim() || cName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: cName.trim(),
        slug,
        description: cDescription.trim()
      });
    } else {
      addCategory({
        name: cName.trim(),
        slug,
        description: cDescription.trim()
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Confirm Delete
  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'product') {
      deleteProduct(deleteConfirm.id);
    } else {
      deleteCategory(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  // Filter products for the table
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      {/* Admin Top Header Bar */}
      <div className="bg-zinc-900 text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-wider">
                Admin Panel
              </span>
              <h1 className="text-lg font-bold text-white">
                Trung Tâm Quản Trị Hệ Thống
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Đang đăng nhập với: <strong>{currentUser?.email || 'admin@shop.vn'}</strong> ({currentUser?.name || 'Admin'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-admin-view-storefront"
              type="button"
              onClick={() => setActiveTab('storefront')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Cửa Hàng Khách</span>
            </button>

            {/* Requirement: Là Admin, tôi muốn Đăng Xuất khi không cần dùng website nữa */}
            <button
              id="btn-admin-logout"
              type="button"
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2 bg-zinc-200/80 p-1 rounded-xl">
            <button
              id="admin-tab-products"
              type="button"
              onClick={() => setAdminTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'products'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Quản Lý Sản Phẩm ({products.length})</span>
            </button>

            <button
              id="admin-tab-categories"
              type="button"
              onClick={() => setAdminTab('categories')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'categories'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Quản Lý Danh Mục ({categories.length})</span>
            </button>

            <button
              id="admin-tab-orders"
              type="button"
              onClick={() => setAdminTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Truck className="w-4 h-4 text-purple-600" />
              <span>Đơn Hàng ({orders.length})</span>
            </button>
          </div>

          {/* Quick Action Button based on tab */}
          <div>
            {adminTab === 'products' && (
              <button
                id="btn-admin-add-product"
                type="button"
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Sản Phẩm Mới</span>
              </button>
            )}

            {adminTab === 'categories' && (
              <button
                id="btn-admin-add-category"
                type="button"
                onClick={handleOpenAddCategory}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Thêm Danh Mục Mới</span>
              </button>
            )}
          </div>
        </div>

        {/* ----------------- TAB 1: SẢN PHẨM (REQUIREMENTS: Thêm, Sửa, Xóa, Bảng table sản phẩm) ----------------- */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            {/* Table Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-product-search-input"
                    type="text"
                    placeholder="Tìm theo tên sản phẩm trong bảng..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">Lọc danh mục:</span>
                <select
                  id="admin-filter-category-select"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="all">Tất cả danh mục ({products.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Requirement: Bảng table chứa các thông tin sản phẩm đang bán */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table id="admin-products-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      <th className="p-3.5 pl-5">Hình Ảnh</th>
                      <th className="p-3.5">Tên Sản Phẩm</th>
                      <th className="p-3.5">Danh Mục</th>
                      <th className="p-3.5">Giá Bán</th>
                      <th className="p-3.5">Tồn Kho</th>
                      <th className="p-3.5">Trạng Thái</th>
                      <th className="p-3.5 text-right pr-5">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-400">
                          Không tìm thấy sản phẩm nào phù hợp điều kiện lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => {
                        const cat = categories.find(c => c.id === p.categoryId);
                        return (
                          <tr
                            key={p.id}
                            id={`admin-product-row-${p.id}`}
                            className="hover:bg-zinc-50/80 transition-colors"
                          >
                            {/* Image */}
                            <td className="p-3.5 pl-5">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200"
                              />
                            </td>

                            {/* Name & Details */}
                            <td className="p-3.5 max-w-xs">
                              <div className="font-bold text-zinc-900 line-clamp-1">
                                {p.name}
                              </div>
                              <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                                Size: {p.sizes.join(', ')} • Màu: {p.colors.join(', ')}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="p-3.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-medium text-[11px]">
                                {cat?.name || 'Chưa phân loại'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-3.5">
                              <div className="font-bold text-zinc-900">
                                {formatVND(p.price)}
                              </div>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <div className="text-[10px] text-zinc-400 line-through">
                                  {formatVND(p.originalPrice)}
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="p-3.5">
                              <span className="font-bold text-zinc-900 font-mono">
                                {p.stock}
                              </span>
                              <span className="text-[10px] text-zinc-400 ml-1">chiếc</span>
                            </td>

                            {/* Status */}
                            <td className="p-3.5">
                              {p.stock > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Đang bán
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  Hết hàng
                                </span>
                              )}
                            </td>

                            {/* Actions (Requirement: Sửa sản phẩm, Xóa sản phẩm) */}
                            <td className="p-3.5 text-right pr-5">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  id={`btn-edit-product-${p.id}`}
                                  type="button"
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                                  title="Sửa thông tin sản phẩm"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`btn-delete-product-${p.id}`}
                                  type="button"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'product',
                                      id: p.id,
                                      title: p.name
                                    })
                                  }
                                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: DANH MỤC (REQUIREMENTS: Thêm, Sửa, Xóa danh mục) ----------------- */}
        {adminTab === 'categories' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table id="admin-categories-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      <th className="p-3.5 pl-5">Tên Danh Mục</th>
                      <th className="p-3.5">Mã / Slug</th>
                      <th className="p-3.5">Mô Tả Danh Mục</th>
                      <th className="p-3.5">Số Lượng Sản Phẩm</th>
                      <th className="p-3.5 text-right pr-5">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {categories.map(c => {
                      const count = products.filter(p => p.categoryId === c.id).length;
                      return (
                        <tr
                          key={c.id}
                          id={`admin-category-row-${c.id}`}
                          className="hover:bg-zinc-50/80 transition-colors"
                        >
                          <td className="p-3.5 pl-5 font-bold text-zinc-900">
                            {c.name}
                          </td>
                          <td className="p-3.5 font-mono text-zinc-500 text-[11px]">
                            {c.slug}
                          </td>
                          <td className="p-3.5 text-zinc-600 max-w-md">
                            {c.description || 'Chưa có mô tả'}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-semibold text-[11px]">
                              {count} sản phẩm
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`btn-edit-cat-${c.id}`}
                                type="button"
                                onClick={() => handleOpenEditCategory(c)}
                                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors"
                                title="Sửa danh mục"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                id={`btn-delete-cat-${c.id}`}
                                type="button"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'category',
                                    id: c.id,
                                    title: c.name
                                  })
                                }
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Xóa danh mục"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: ĐƠN HÀNG (Admin Quản lý & Cập nhật trạng thái) ----------------- */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table id="admin-orders-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      <th className="p-3.5 pl-5">Mã Đơn</th>
                      <th className="p-3.5">Khách Hàng</th>
                      <th className="p-3.5">Số Sản Phẩm</th>
                      <th className="p-3.5">Tổng Tiền</th>
                      <th className="p-3.5">Thanh Toán</th>
                      <th className="p-3.5">Trạng Thái Đơn</th>
                      <th className="p-3.5 text-right pr-5">Đổi Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-400">
                          Chưa có đơn hàng nào trong hệ thống.
                        </td>
                      </tr>
                    ) : (
                      orders.map(ord => (
                        <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="p-3.5 pl-5 font-mono font-bold text-zinc-900">
                            {ord.orderNumber}
                            <div className="text-[10px] text-zinc-400 font-sans">
                              {formatDate(ord.createdAt)}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900">{ord.customerName}</div>
                            <div className="text-[11px] text-zinc-500 font-mono">{ord.customerPhone}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold">{ord.items.length} món</span>
                          </td>
                          <td className="p-3.5 font-bold text-zinc-900">
                            {formatVND(ord.totalAmount)}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                ord.isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.isPaid ? 'Đã Thanh Toán' : 'Thu COD'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                getStatusBadge(ord.status).color
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  getStatusBadge(ord.status).dot
                                }`}
                              />
                              {getStatusBadge(ord.status).label}
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-5">
                            <select
                              value={ord.status}
                              onChange={e =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-900"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="processing">Đang đóng gói</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="delivered">Giao thành công</option>
                              <option value="cancelled">Hủy đơn</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- MODAL: THÊM / SỬA SẢN PHẨM ----------------- */}
      {isProductModalOpen && (
        <div
          id="product-form-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm Đang Bán' : 'Thêm Sản Phẩm Mới Để Đăng Bán'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    id="admin-input-prod-name"
                    type="text"
                    required
                    placeholder="Ví dụ: Áo Sơ Mi Lụa Cổ Cuba"
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Danh mục sản phẩm *
                  </label>
                  <select
                    id="admin-select-prod-cat"
                    value={pCategoryId}
                    onChange={e => setPCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Số lượng tồn kho *
                  </label>
                  <input
                    id="admin-input-prod-stock"
                    type="number"
                    min="0"
                    required
                    value={pStock}
                    onChange={e => setPStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Giá bán thực tế (VNĐ) *
                  </label>
                  <input
                    id="admin-input-prod-price"
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={pPrice}
                    onChange={e => setPPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Giá gốc niêm yết (gạch ngang, tùy chọn)
                  </label>
                  <input
                    id="admin-input-prod-original-price"
                    type="number"
                    min="0"
                    step="1000"
                    value={pOriginalPrice}
                    onChange={e => setPOriginalPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Các Size (cách nhau dấu phẩy)
                  </label>
                  <input
                    id="admin-input-prod-sizes"
                    type="text"
                    placeholder="S, M, L, XL"
                    value={pSizes}
                    onChange={e => setPSizes(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Các Màu sắc (cách nhau dấu phẩy)
                  </label>
                  <input
                    id="admin-input-prod-colors"
                    type="text"
                    placeholder="Trắng, Đen, Xanh Navy"
                    value={pColors}
                    onChange={e => setPColors(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Link Ảnh Sản Phẩm (URL) *
                  </label>
                  <input
                    id="admin-input-prod-image"
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={pImage}
                    onChange={e => setPImage(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 mb-2"
                  />

                  {/* Sample presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-zinc-400 text-[11px] shrink-0">Chọn ảnh mẫu nhanh:</span>
                    {SAMPLE_IMAGES.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPImage(sample.url)}
                        className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] shrink-0 transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Mô tả chi tiết sản phẩm
                  </label>
                  <textarea
                    id="admin-input-prod-desc"
                    rows={3}
                    placeholder="Mô tả chất liệu, kiểu dáng, hướng dẫn chọn size..."
                    value={pDescription}
                    onChange={e => setPDescription(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                >
                  Hủy
                </button>
                <button
                  id="btn-admin-save-product-submit"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Đăng Bán Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: THÊM / SỬA DANH MỤC ----------------- */}
      {isCategoryModalOpen && (
        <div
          id="category-form-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">
                {editingCategory ? 'Chỉnh Sửa Loại Danh Mục' : 'Thêm Loại Danh Mục Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tên danh mục *
                </label>
                <input
                  id="admin-input-cat-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Áo Len & Hoodie"
                  value={cName}
                  onChange={e => setCName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mã Slug (tùy chọn)
                </label>
                <input
                  id="admin-input-cat-slug"
                  type="text"
                  placeholder="ao-len-hoodie"
                  value={cSlug}
                  onChange={e => setCSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mô tả danh mục
                </label>
                <textarea
                  id="admin-input-cat-desc"
                  rows={2}
                  placeholder="Mô tả các sản phẩm thuộc danh mục này..."
                  value={cDescription}
                  onChange={e => setCDescription(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                >
                  Hủy
                </button>
                <button
                  id="btn-admin-save-cat-submit"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingCategory ? 'Lưu Thay Đổi' : 'Thêm Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: XÁC NHẬN XÓA ----------------- */}
      {deleteConfirm && (
        <div
          id="delete-confirm-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-1">
              Xác nhận xóa {deleteConfirm.type === 'product' ? 'sản phẩm' : 'danh mục'}?
            </h3>
            <p className="text-xs text-zinc-600 mb-4">
              Bạn có chắc chắn muốn xóa "<strong>{deleteConfirm.title}</strong>"? Thao tác này sẽ gỡ bỏ khỏi hệ thống bán.
            </p>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                Hủy bỏ
              </button>
              <button
                id="btn-confirm-delete-action"
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
