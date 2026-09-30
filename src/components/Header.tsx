import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Shield,
  Truck,
  LogOut,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileFilter }) => {
  const {
    currentUser,
    logout,
    cartCount,
    setIsCartOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsTrackingOpen,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-zinc-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ưu đãi hôm nay
            </span>
            <span className="hidden sm:inline text-zinc-300">
              Miễn phí vận chuyển cho đơn hàng từ 500.000₫ • Đổi trả trong 30 ngày
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <button
              id="btn-nav-order-tracking"
              type="button"
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tra Cứu & Theo Dõi Đơn Hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="btn-logo-home"
              type="button"
              onClick={() => setActiveTab('storefront')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-zinc-900 block leading-tight">
                  URBAN THREADS
                </span>
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                  Thời Trang Cao Cấp
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar (Requirement: Tìm Kiếm sản phẩm theo tên) */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên (áo thun, sơ mi, jean...)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white border border-zinc-200 rounded-full text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  id="btn-clear-search"
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Button */}
            {activeTab === 'storefront' && onOpenMobileFilter && (
              <button
                id="btn-mobile-filter-open"
                type="button"
                onClick={onOpenMobileFilter}
                className="lg:hidden p-2 rounded-xl text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                title="Bộ lọc"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            {/* Cart Button */}
            <button
              id="btn-header-cart"
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Giỏ Hàng</span>
              {cartCount > 0 && (
                <span
                  id="header-cart-badge"
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Area */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Admin button if logged in as Admin */}
                {currentUser.role === 'admin' && (
                  <button
                    id="btn-header-go-admin"
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Vào Bảng Quản Trị Cửa Hàng"
                  >
                    <Shield className="w-3.5 h-3.5 fill-zinc-950" />
                    <span className="hidden sm:inline">Quản Trị Cửa Hàng</span>
                    <span className="sm:hidden">Admin</span>
                  </button>
                )}

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-zinc-900 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
                  </span>
                </div>

                <button
                  id="btn-header-logout"
                  type="button"
                  onClick={logout}
                  className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Đăng xuất khỏi website"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-header-login"
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="py-2 px-3.5 sm:px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
