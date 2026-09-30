import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { formatVND } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500000;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartTotal);
  const freeShipPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          onClick={e => e.stopPropagation()}
          className="w-screen max-w-md bg-white shadow-2xl border-l border-zinc-200 flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">
                Giỏ Hàng Của Bạn ({cartCount})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  id="btn-clear-cart"
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-zinc-400 hover:text-rose-600 transition-colors"
                >
                  Xóa tất cả
                </button>
              )}
              <button
                id="btn-close-cart-drawer"
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-zinc-50 p-3.5 border-b border-zinc-100 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-zinc-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {remainingForFreeShip > 0 ? (
                  <span>
                    Mua thêm <strong className="text-rose-600">{formatVND(remainingForFreeShip)}</strong> để được FREESHIP
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">
                    🎉 Bạn đã đủ điều kiện nhận MIỄN PHÍ VẬN CHUYỂN!
                  </span>
                )}
              </span>
              <span className="text-zinc-400 font-mono text-[11px]">
                {Math.round(freeShipPercent)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${freeShipPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-zinc-800 text-sm">Giỏ hàng đang trống</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
                  Hãy khám phá các mẫu quần áo thời trang mới nhất và thêm vào giỏ.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Bắt Đầu Mua Sắm
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-22 object-cover rounded-xl bg-zinc-100 shrink-0 border border-zinc-200/60"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                          Size: {item.selectedSize}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                          Màu: {item.selectedColor}
                        </span>
                      </div>
                    </div>

                    {/* Price and Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                      <span className="text-xs font-bold text-zinc-900">
                        {formatVND(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 text-xs font-bold disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-semibold">{formatVND(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Phí giao hàng:</span>
                  <span>
                    {remainingForFreeShip === 0 ? (
                      <strong className="text-emerald-600">Miễn phí</strong>
                    ) : (
                      '30.000 ₫'
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Tổng thanh toán dự kiến:</span>
                  <span className="text-base text-rose-600 font-black">
                    {formatVND(cartTotal + (remainingForFreeShip === 0 ? 0 : 30000))}
                  </span>
                </div>
              </div>

              <button
                id="btn-proceed-to-checkout"
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tiến Hành Đặt Hàng & Thanh Toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
