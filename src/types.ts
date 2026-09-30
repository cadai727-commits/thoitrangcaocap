export type Role = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  image: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique key for product+size+color
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  stock: number;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay' | 'credit_card';

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  time?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  note?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}
