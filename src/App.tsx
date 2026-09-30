import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { CustomerFilterSidebar } from './components/CustomerFilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import {
  ShieldAlert,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Truck,
  RotateCcw,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { formatVND } from './utils/format';

const StorefrontView: React.FC = () => {
  const {
    products,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategoryIds,
    priceFilter,
    sortBy,
    setSortBy,
    clearCategoryFilter,
    setPriceFilter,
    currentUser,
    setActiveTab,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products according to:
  // 1. Search term by name
  // 2. Selected categories (checkboxes)
  // 3. Price range
  // 4. Sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // 1. Name search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Category checkboxes
      if (selectedCategoryIds.length > 0) {
        if (!selectedCategoryIds.includes(product.categoryId)) {
          return false;
        }
      }

      // 3. Price range
      if (product.price < priceFilter.min || product.price > priceFilter.max) {
        return false;
      }

      return true;
    });

    // 4. Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategoryIds, priceFilter, sortBy]);

  const activeCategoryNames = categories
    .filter(c => selectedCategoryIds.includes(c.id))
    .map(c => c.name);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <Header onOpenMobileFilter={() => setMobileFilterOpen(true)} />

      {/* Hero Banner Showcase */}
      <section className="bg-zinc-900 text-white py-8 sm:py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bộ Sưu Tập Thời Trang Xuân Hè 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Phong Cách Tối Giản, Đẳng Cấp & Thanh Lịch
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-xl">
                Khám phá các mẫu áo sơ mi, áo thun polo dệt tổ ong, quần denim và blazer phối màu tinh tế. Mua sắm dễ dàng, giao hàng hỏa tốc và thanh toán linh hoạt.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-center">
                <span className="block text-xl font-bold text-amber-400">100%</span>
                <span className="text-[11px] text-zinc-400">Chất Liệu Cao Cấp</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-center">
                <span className="block text-xl font-bold text-emerald-400">30 Ngày</span>
                <span className="text-[11px] text-zinc-400">Đổi Trả Dễ Dàng</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-center">
                <span className="block text-xl font-bold text-blue-400">Freeship</span>
                <span className="text-[11px] text-zinc-400">Đơn Từ 500.000₫</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar Filters + Product Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar: Checkbox Categories & Price Filter */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <CustomerFilterSidebar />
          </div>

          {/* Right Area: Catalog Header + Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Catalog Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900">
                    Danh Sách Sản Phẩm
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono">
                    {filteredProducts.length} sản phẩm
                  </span>
                </div>

                {/* Active Filter Chips */}
                {(searchTerm || activeCategoryNames.length > 0 || priceFilter.min > 0 || priceFilter.max < 2000000) && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-zinc-400">Đang lọc:</span>

                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-medium">
                        Từ khóa: "{searchTerm}"
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="hover:text-rose-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {activeCategoryNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                      >
                        {name}
                      </span>
                    ))}

                    {(priceFilter.min > 0 || priceFilter.max < 2000000) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-medium border border-blue-200">
                        {formatVND(priceFilter.min)} - {formatVND(priceFilter.max)}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        clearCategoryFilter();
                        setPriceFilter({ min: 0, max: 2000000 });
                        setSearchTerm('');
                      }}
                      className="text-[11px] text-rose-600 hover:underline font-medium ml-1"
                    >
                      Xóa lọc
                    </button>
                  </div>
                )}
              </div>

              {/* Sorting selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
                  Sắp xếp theo:
                </span>
                <div className="relative">
                  <select
                    id="select-sort-by"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                  >
                    <option value="featured">Nổi bật nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="name_asc">Tên sản phẩm: A - Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-800">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Hãy thử thay đổi từ khóa tìm kiếm, tích chọn danh mục khác hoặc điều chỉnh lại khoảng giá lọc.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearCategoryFilter();
                    setPriceFilter({ min: 0, max: 2000000 });
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Xóa Tất Cả Bộ Lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl p-4 overflow-y-auto">
            <CustomerFilterSidebar onCloseMobile={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <span className="text-base font-black tracking-tight text-zinc-900 block">
                URBAN THREADS
              </span>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Hệ thống thời trang nam nữ phong cách hiện đại. Cam kết chất lượng vải cao cấp, giao hàng nhanh chóng trên toàn quốc.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Chăm Sóc Khách Hàng
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li>Hướng dẫn chọn size quần áo</li>
                <li>Chính sách giao hàng & đổi trả 30 ngày</li>
                <li>Theo dõi và tra cứu đơn hàng</li>
                <li>Phương thức thanh toán bảo mật</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Liên Hệ Với Chúng Tôi
              </h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hotline: 1900 6868 (8:00 - 21:30)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Email: support@urbanthreads.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hà Nội & TP. Hồ Chí Minh</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Phương Thức Thanh Toán
              </h4>
              <p className="text-xs text-zinc-500 mb-3">
                Hỗ trợ COD tiền mặt, chuyển khoản QR VietQR, MoMo, VNPAY và thẻ quốc tế Visa / Mastercard.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-zinc-600">
                <span className="px-2 py-1 bg-zinc-100 rounded border border-zinc-200">COD</span>
                <span className="px-2 py-1 bg-zinc-100 rounded border border-zinc-200">VietQR</span>
                <span className="px-2 py-1 bg-zinc-100 rounded border border-zinc-200">MoMo</span>
                <span className="px-2 py-1 bg-zinc-100 rounded border border-zinc-200">VNPAY</span>
                <span className="px-2 py-1 bg-zinc-100 rounded border border-zinc-200">Visa / Master</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
            <span>© 2026 Urban Threads. Toàn bộ quyền được bảo lưu.</span>
            <div className="flex items-center gap-4">
              <button
                id="btn-footer-admin-link"
                type="button"
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    setActiveTab('admin');
                  } else {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-zinc-400 hover:text-zinc-700 underline text-xs cursor-pointer transition-colors"
              >
                Cổng Quản Trị Viên (Admin)
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    toastMessage
  } = useStore();

  return (
    <>
      {activeTab === 'admin' ? (
        currentUser?.role === 'admin' ? (
          <AdminPanel />
        ) : (
          <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900">
                Yêu Cầu Quyền Quản Trị Viên (Admin)
              </h2>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Bạn cần đăng nhập bằng tài khoản Quản trị để quản lý sản phẩm, danh mục và đơn hàng của website.
              </p>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Đăng Nhập Tài Khoản Admin Ngay
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('storefront')}
                  className="w-full py-2 px-4 text-xs text-zinc-600 hover:text-zinc-900 font-medium"
                >
                  Quay lại Cửa Hàng (Dành cho Khách Hàng)
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <StorefrontView />
      )}

      {/* Global Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AuthModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-message"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-zinc-700 flex items-center gap-3 animate-slide-up"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
