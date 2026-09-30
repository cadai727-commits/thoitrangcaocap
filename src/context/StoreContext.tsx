import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, User, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../mockData';

interface StoreContextType {
  // Authentication
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string; user?: User };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string; user?: User };
  forgotPassword: (email: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => { success: boolean; message?: string };

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: Order['paymentMethod'];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Customer Filtering & Searching
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategoryIds: string[];
  toggleCategoryFilter: (categoryId: string) => void;
  clearCategoryFilter: () => void;
  priceFilter: { min: number; max: number };
  setPriceFilter: (range: { min: number; max: number }) => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'name_asc';
  setSortBy: (sort: 'featured' | 'price_asc' | 'price_desc' | 'name_asc') => void;

  // Navigation & UI States
  activeTab: 'storefront' | 'admin';
  setActiveTab: (tab: 'storefront' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderNumber: string;
  setTrackingOrderNumber: (num: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with local storage fallback
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('shop_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('shop_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shop_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('shop_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shop_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'storefront' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('shop_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.role === 'admin') return 'admin';
      }
    } catch {
      // ignore
    }
    return 'storefront';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 2000000 });
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shop_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shop_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shop_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('shop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shop_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shop_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Auth Methods
  const login = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'Email này chưa được đăng ký tài khoản.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác, vui lòng thử lại.' };
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);

    // Requirement: Đăng nhập khi đúng tài khoản admin thì tự động vào quản trị cửa hàng
    if (found.role === 'admin') {
      setActiveTab('admin');
      showToast(`Đăng nhập thành công! Chào mừng Quản Trị Viên ${found.name}. Đã tự động chuyển vào Quản Trị Cửa Hàng.`);
    } else {
      setActiveTab('storefront');
      showToast(`Xin chào ${found.name}! Đăng nhập thành công.`);
    }

    return { success: true, message: 'Đăng nhập thành công', user: found };
  };

  const register = (name: string, email: string, phone: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      role: 'customer',
      password
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Đăng ký thành công! Chào mừng ${newUser.name} đến với cửa hàng.`);
    return { success: true, message: 'Đăng ký thành công', user: newUser };
  };

  const forgotPassword = (email: string, newPassword: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, message: 'Không tìm thấy tài khoản với email này.' };
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setUsers(updatedUsers);
    showToast('Khôi phục mật khẩu thành công! Bạn có thể đăng nhập ngay.');
    return { success: true, message: 'Mật khẩu đã được cập nhật thành công.' };
  };

  const logout = () => {
    const wasAdmin = currentUser?.role === 'admin';
    setCurrentUser(null);
    if (wasAdmin) {
      setActiveTab('storefront');
    }
    showToast('Đã đăng xuất tài khoản an toàn.');
  };

  // Product Methods
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Đã thêm sản phẩm "${newProduct.name}" vào danh sách bán.`);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast(`Đã cập nhật thông tin sản phẩm "${updatedProduct.name}".`);
  };

  const deleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(`Đã xóa sản phẩm "${target?.name || ''}".`);
  };

  // Category Methods
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCategory]);
    showToast(`Đã thêm danh mục mới "${newCategory.name}".`);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    showToast(`Đã cập nhật danh mục "${updatedCategory.name}".`);
  };

  const deleteCategory = (categoryId: string) => {
    const count = products.filter(p => p.categoryId === categoryId).length;
    if (count > 0) {
      return {
        success: false,
        message: `Không thể xóa vì còn ${count} sản phẩm đang thuộc danh mục này. Hãy đổi danh mục cho sản phẩm trước.`
      };
    }
    const target = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setSelectedCategoryIds(prev => prev.filter(id => id !== categoryId));
    showToast(`Đã xóa danh mục "${target?.name || ''}".`);
    return { success: true };
  };

  // Cart Methods
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          selectedSize: size,
          selectedColor: color,
          quantity,
          stock: product.stock
        }
      ];
    });
    showToast(`Đã thêm "${product.name}" (${size}, ${color}) vào giỏ hàng!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Orders
  const createOrder = (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const subtotal = cartTotal;
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      note: data.note,
      items: [...cart],
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: data.paymentMethod,
      isPaid: data.paymentMethod !== 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Reduce product stocks
    setProducts(prev =>
      prev.map(p => {
        const itemInCart = cart.find(c => c.productId === p.id);
        if (itemInCart) {
          return { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderNumber(orderNumber);
    showToast(`Đặt hàng thành công! Mã đơn hàng: ${orderNumber}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              isPaid: status === 'delivered' ? true : o.isPaid
            }
          : o
      )
    );
    showToast('Đã cập nhật trạng thái đơn hàng.');
  };

  // Category Filtering
  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryIds([]);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        login,
        register,
        forgotPassword,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        createOrder,
        updateOrderStatus,
        searchTerm,
        setSearchTerm,
        selectedCategoryIds,
        toggleCategoryFilter,
        clearCategoryFilter,
        priceFilter,
        setPriceFilter,
        sortBy,
        setSortBy,
        activeTab,
        setActiveTab,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderNumber,
        setTrackingOrderNumber,
        selectedProductForDetail,
        setSelectedProductForDetail,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
