import { OrderStatus, PaymentMethod } from '../types';

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return isoString;
  }
};

export const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ xác nhận',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'processing':
      return {
        label: 'Đang đóng gói',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      };
    case 'shipping':
      return {
        label: 'Đang giao hàng',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500'
      };
    case 'delivered':
      return {
        label: 'Giao thành công',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'cancelled':
      return {
        label: 'Đã hủy đơn',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500'
      };
    default:
      return {
        label: status,
        color: 'bg-zinc-50 text-zinc-700 border-zinc-200',
        dot: 'bg-zinc-400'
      };
  }
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case 'cod':
      return 'Thanh toán tiền mặt khi nhận hàng (COD)';
    case 'bank_transfer':
      return 'Chuyển khoản ngân hàng (QR Code)';
    case 'momo':
      return 'Ví điện tử MoMo';
    case 'vnpay':
      return 'Cổng thanh toán VNPAY / Thẻ nội địa';
    case 'credit_card':
      return 'Thẻ Quốc Tế (Visa, Master, JCB)';
    default:
      return method;
  }
};
