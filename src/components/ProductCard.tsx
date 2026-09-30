import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { formatVND } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { categories, addToCart, setSelectedProductForDetail } = useStore();

  const category = categories.find(c => c.id === product.categoryId);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first available size and color
    const defaultSize = product.sizes?.[0] || 'Freesize';
    const defaultColor = product.colors?.[0] || 'Mặc định';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProductForDetail(product)}
      className="group relative bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/5 w-full bg-zinc-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Status Badge */}
        {product.stock <= 0 ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-200 text-[11px] font-medium backdrop-blur-xs">
            Hết hàng
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
            Chỉ còn {product.stock}
          </span>
        ) : null}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
          <button
            id={`btn-quick-view-${product.id}`}
            type="button"
            onClick={e => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="p-2.5 rounded-full bg-white text-zinc-900 shadow-md hover:bg-zinc-100 transition-transform hover:scale-110"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>

          {product.stock > 0 && (
            <button
              id={`btn-quick-add-${product.id}`}
              type="button"
              onClick={handleQuickAdd}
              className="px-3.5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-md hover:bg-black transition-transform hover:scale-105 flex items-center gap-1.5"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Thêm vào giỏ</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              {category?.name || 'Thời trang'}
            </span>
            <div className="flex items-center gap-1 text-zinc-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            id={`product-name-${product.id}`}
            className="font-semibold text-zinc-900 text-sm line-clamp-2 hover:text-zinc-700 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Sizes and Colors preview */}
        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-zinc-500">
          <span className="font-medium text-zinc-600">Size:</span>
          <span>{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</span>
          <span className="mx-1 text-zinc-300">•</span>
          <span>{product.colors.length} màu sắc</span>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span
              id={`product-price-${product.id}`}
              className="text-base font-bold text-zinc-900"
            >
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            id={`btn-card-add-cart-${product.id}`}
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              product.stock > 0
                ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 text-zinc-800'
                : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
            }`}
            title="Thêm vào giỏ"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
