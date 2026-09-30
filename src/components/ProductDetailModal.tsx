import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { formatVND } from '../utils/format';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    categories,
    addToCart,
    setIsCartOpen
  } = useStore();

  const product = selectedProductForDetail;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'Freesize');
      setSelectedColor(product.colors?.[0] || 'Mặc định');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const category = categories.find(c => c.id === product.categoryId);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (openCartDrawer = false) => {
    if (product.stock <= 0) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    if (openCartDrawer) {
      setSelectedProductForDetail(null);
      setIsCartOpen(true);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-zinc-700 bg-white/80 hover:bg-white rounded-full shadow-xs transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image Column */}
          <div className="relative bg-zinc-100 aspect-4/5 md:aspect-auto">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs">
                Giảm {discountPercent}%
              </span>
            )}
          </div>

          {/* Product Info Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {category?.name || 'Thời trang cao cấp'}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-200 fill-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-zinc-700">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">({product.reviewsCount} đánh giá)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-black text-zinc-900">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Mô tả sản phẩm
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Chọn kích cỡ (Size):
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {selectedSize}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                          : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Chọn màu sắc:
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500'
                          : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Số lượng mua:
                </span>
                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Notice */}
              <div className="mt-2 text-right">
                <span className="text-[11px] text-zinc-500">
                  Kho còn: <strong className="text-zinc-800">{product.stock}</strong> sản phẩm
                </span>
              </div>
            </div>

            {/* Actions & Value Props */}
            <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-modal-add-to-cart"
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={product.stock <= 0}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-900'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã Thêm!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Thêm Vào Giỏ</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-modal-buy-now"
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mua Ngay</span>
                </button>
              </div>

              {/* Policy Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-zinc-500">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Freeship từ 500k</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đổi trả 30 ngày</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Chính hãng 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
