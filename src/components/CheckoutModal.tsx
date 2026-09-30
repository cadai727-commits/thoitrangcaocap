import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { formatVND } from '../utils/format';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    currentUser,
    createOrder,
    setIsTrackingOpen
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingFee = cartTotal > 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Vui lòng điền Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    setIsSubmitting(true);

    try {
      createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || 'khachle@shop.vn',
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim(),
        paymentMethod
      });

      setIsCheckoutOpen(false);
      setIsTrackingOpen(true);
    } catch {
      setErrorMsg('Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Xác Nhận Đặt Hàng & Thanh Toán
              </h3>
              <p className="text-xs text-zinc-500">
                Vui lòng điền địa chỉ và chọn phương thức thanh toán thuận tiện.
              </p>
            </div>
          </div>

          <button
            id="btn-close-checkout"
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Customer & Shipping Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Thông Tin Nhận Hàng</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="checkout-input-name"
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Số điện thoại liên hệ *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="checkout-input-phone"
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Địa chỉ email (nhận thông báo đơn hàng)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="checkout-input-email"
                    type="email"
                    placeholder="email@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <textarea
                  id="checkout-input-address"
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Ghi chú cho shipper (tùy chọn)
                </label>
                <input
                  id="checkout-input-note"
                  type="text"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Methods (Requirement: Lựa chọn phương thức thanh toán) */}
          <div className="pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Lựa Chọn Phương Thức Thanh Toán</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: COD */}
              <label
                id="payment-method-cod"
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      Tiền Mặt (COD)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Thanh toán trực tiếp khi nhân viên giao hàng đến
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer QR */}
              <label
                id="payment-method-bank"
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      Chuyển Khoản Ngân Hàng
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Quét mã VietQR tự động xác nhận giao dịch
                  </p>
                </div>
              </label>

              {/* Option 3: MoMo */}
              <label
                id="payment-method-momo"
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'momo'
                    ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      Ví Điện Tử MoMo
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Thanh toán nhanh không cần thẻ ngân hàng
                  </p>
                </div>
              </label>

              {/* Option 4: VNPAY */}
              <label
                id="payment-method-vnpay"
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'vnpay'
                    ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={() => setPaymentMethod('vnpay')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      Cổng VNPAY / ATM
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Hỗ trợ tất cả các ngân hàng Việt Nam
                  </p>
                </div>
              </label>

              {/* Option 5: Credit Card */}
              <label
                id="payment-method-card"
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all sm:col-span-2 ${
                  paymentMethod === 'credit_card'
                    ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      Thẻ Tín Dụng Quốc Tế (Visa, Master, JCB)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Bảo mật 3D-Secure chuẩn quốc tế
                  </p>
                </div>
              </label>
            </div>

            {/* Simulated Payment Instructions for Non-COD */}
            {paymentMethod === 'bank_transfer' && (
              <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <div className="font-bold mb-1">Thông tin tài khoản nhận chuyển khoản:</div>
                <div className="space-y-0.5 text-[11px]">
                  <div>Ngân hàng: <strong>MB Bank (Quân Đội)</strong></div>
                  <div>Số tài khoản: <strong>9999 8888 6666</strong></div>
                  <div>Chủ tài khoản: <strong>CỬA HÀNG THỜI TRANG URBAN THREADS</strong></div>
                  <div className="text-blue-700 italic">Hệ thống sẽ tự động quét mã và xác nhận ngay khi bạn đặt hàng!</div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Order Summary */}
          <div className="pt-4 border-t border-zinc-100 bg-zinc-50 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-zinc-800 mb-1">Tóm tắt đơn hàng ({cart.length} sản phẩm):</div>
            <div className="flex justify-between text-zinc-600">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold">{formatVND(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí (đơn {'>'} 500k)</strong> : '30.000 ₫'}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
              <span>Tổng cộng thanh toán:</span>
              <span className="text-base text-rose-600 font-black">{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
            >
              Quay lại
            </button>
            <button
              id="btn-confirm-place-order"
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
