import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { formatVND, formatDate, getStatusBadge, getPaymentMethodLabel } from '../utils/format';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    orders,
    currentUser,
    trackingOrderNumber,
    setTrackingOrderNumber
  } = useStore();

  const [searchInput, setSearchInput] = useState(trackingOrderNumber || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (trackingOrderNumber) {
      setSearchInput(trackingOrderNumber);
      const found = orders.find(
        o => o.orderNumber.toLowerCase() === trackingOrderNumber.toLowerCase()
      );
      if (found) {
        setSelectedOrder(found);
      }
    } else if (orders.length > 0) {
      // Default to the latest order if available
      const customerOrders = currentUser
        ? orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email)
        : orders;
      if (customerOrders.length > 0) {
        setSelectedOrder(customerOrders[0]);
        setSearchInput(customerOrders[0].orderNumber);
      }
    }
  }, [trackingOrderNumber, isTrackingOpen, orders, currentUser]);

  if (!isTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const found = orders.find(
      o => o.orderNumber.toUpperCase() === query || o.id === query
    );
    setSelectedOrder(found || null);
  };

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'pending', label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được ghi nhận trên hệ thống' },
      { key: 'processing', label: 'Đang đóng gói', desc: 'Cửa hàng đang đóng gói sản phẩm cẩn thận' },
      { key: 'shipping', label: 'Đang giao hàng', desc: 'Đơn vị vận chuyển đang phát hàng đến bạn' },
      { key: 'delivered', label: 'Giao thành công', desc: 'Khách hàng đã nhận hàng và hoàn tất' }
    ];

    const statusOrder: Record<OrderStatus, number> = {
      pending: 0,
      processing: 1,
      shipping: 2,
      delivered: 3,
      cancelled: -1
    };

    const currentLevel = statusOrder[status];

    return steps.map((s, index) => {
      const isCompleted = currentLevel >= index;
      const isCurrent = currentLevel === index;
      return { ...s, isCompleted, isCurrent };
    });
  };

  // Orders relevant to current user
  const relevantOrders = currentUser
    ? orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email)
    : orders;

  return (
    <div
      id="order-tracking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="order-tracking-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Theo Dõi & Tra Cứu Đơn Hàng
              </h3>
              <p className="text-xs text-zinc-500">
                Kiểm tra tiến độ đóng gói, vận chuyển và chi tiết các sản phẩm đã đặt
              </p>
            </div>
          </div>

          <button
            id="btn-close-tracking-modal"
            type="button"
            onClick={() => {
              setIsTrackingOpen(false);
              setTrackingOrderNumber('');
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for Order Tracking */}
        <div className="p-5 bg-zinc-50 border-b border-zinc-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-tracking-search"
                type="text"
                placeholder="Nhập mã đơn hàng (ví dụ: ORD-89412, ORD-77123...)"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900 uppercase"
              />
            </div>
            <button
              id="btn-search-order"
              type="submit"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Tra Cứu
            </button>
          </form>

          {/* Quick list of orders to click */}
          {relevantOrders.length > 0 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-zinc-500 text-[11px] shrink-0 font-medium">
                Đơn hàng gần đây:
              </span>
              {relevantOrders.map(ord => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrder(ord);
                    setSearchInput(ord.orderNumber);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                    selectedOrder?.id === ord.id
                      ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {selectedOrder ? (
            <div>
              {/* Order Header Summary */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-semibold">Mã đơn hàng:</span>
                    <span className="text-base font-bold font-mono text-zinc-900">
                      {selectedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Đặt lúc: {formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      getStatusBadge(selectedOrder.status).color
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        getStatusBadge(selectedOrder.status).dot
                      }`}
                    />
                    {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="mt-6 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-4">
                  Tiến Trình Đơn Hàng
                </h4>

                {selectedOrder.status === 'cancelled' ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Đơn hàng này đã bị hủy. Vui lòng liên hệ hotline hỗ trợ nếu bạn cần giải đáp.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border relative transition-all ${
                          step.isCurrent
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                            : step.isCompleted
                            ? 'bg-zinc-50/80 border-zinc-200'
                            : 'bg-white border-zinc-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-200 text-zinc-600'
                            }`}
                          >
                            {step.isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              step.isCurrent
                                ? 'text-emerald-950'
                                : step.isCompleted
                                ? 'text-zinc-800'
                                : 'text-zinc-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping and Customer Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Thông Tin Nhận Hàng</span>
                  </h4>
                  <div className="text-xs space-y-1 text-zinc-600">
                    <div>
                      Người nhận: <strong className="text-zinc-900">{selectedOrder.customerName}</strong>
                    </div>
                    <div>
                      Điện thoại: <span className="font-mono text-zinc-900">{selectedOrder.customerPhone}</span>
                    </div>
                    <div>Email: {selectedOrder.customerEmail}</div>
                    <div className="pt-1 text-zinc-800">
                      Địa chỉ: {selectedOrder.shippingAddress}
                    </div>
                    {selectedOrder.note && (
                      <div className="pt-1 text-zinc-500 italic">
                        Ghi chú: "{selectedOrder.note}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Thanh Toán & Vận Chuyển</span>
                  </h4>
                  <div className="text-xs space-y-1 text-zinc-600">
                    <div>
                      Hình thức:{' '}
                      <strong className="text-zinc-900">
                        {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                      </strong>
                    </div>
                    <div className="flex items-center gap-2">
                      Trạng thái thanh toán:{' '}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          selectedOrder.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedOrder.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán (Thu khi giao)'}
                      </span>
                    </div>
                    <div>Đơn vị vận chuyển: <strong>Giao Hàng Tiết Kiệm (GHTK Express)</strong></div>
                    <div className="text-[11px] text-zinc-500 pt-1">
                      Cập nhật lần cuối: {formatDate(selectedOrder.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Danh Sách Sản Phẩm Trong Đơn</span>
                </h4>

                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded-lg bg-zinc-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-zinc-900 truncate">
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Màu: <strong>{item.selectedColor}</strong></span>
                            <span>•</span>
                            <span>SL: <strong>x{item.quantity}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-zinc-900">
                          {formatVND(item.price * item.quantity)}
                        </span>
                        <div className="text-[10px] text-zinc-400">
                          {formatVND(item.price)}/sp
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pricing breakdown */}
                  <div className="p-3.5 bg-zinc-50 text-xs space-y-1">
                    <div className="flex justify-between text-zinc-600">
                      <span>Tiền hàng:</span>
                      <span>{formatVND(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Phí giao hàng:</span>
                      <span>{selectedOrder.shippingFee === 0 ? 'Miễn phí' : formatVND(selectedOrder.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                      <span>Tổng giá trị đơn:</span>
                      <span className="text-sm font-black text-rose-600">
                        {formatVND(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-800">Không tìm thấy đơn hàng</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Vui lòng kiểm tra lại mã đơn hàng hoặc chọn một đơn trong danh sách gần đây phía trên.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
