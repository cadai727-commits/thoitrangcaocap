import { Category, Product, User, Order } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Áo Thun & Polo',
    slug: 'ao-thun-polo',
    description: 'Áo thun cotton thoáng mát, form rộng unisex, áo polo lịch lãm hiện đại',
    icon: 'Shirt'
  },
  {
    id: 'cat-2',
    name: 'Áo Sơ Mi',
    slug: 'ao-so-mi',
    description: 'Sơ mi công sở, sơ mi oxford cổ điển, sơ mi lụa mềm mại',
    icon: 'Briefcase'
  },
  {
    id: 'cat-3',
    name: 'Quần Jean & Kaki',
    slug: 'quan-jean-kaki',
    description: 'Quần jean ống rộng, skinny, quần baggy và kaki co giãn thoải mái',
    icon: 'Scissors'
  },
  {
    id: 'cat-4',
    name: 'Áo Khoác & Blazer',
    slug: 'ao-khoac-blazer',
    description: 'Áo bomber, blazer thanh lịch, áo khoác dù chống nước nhẹ',
    icon: 'Layers'
  },
  {
    id: 'cat-5',
    name: 'Váy & Đầm Nữ',
    slug: 'vay-dam-nu',
    description: 'Đầm xòe dự tiệc, chân váy chữ A, đầm maxi đi biển nữ tính',
    icon: 'Sparkles'
  },
  {
    id: 'cat-6',
    name: 'Phụ Kiện Thời Trang',
    slug: 'phu-kien-thoi-trang',
    description: 'Thắt lưng da, nón lưỡi trai, túi tote canvas cá tính',
    icon: 'Watch'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Áo Thun Cổ Tròn Cotton 100% Phối Túi Vintage',
    categoryId: 'cat-1',
    price: 189000,
    originalPrice: 250000,
    stock: 45,
    description: 'Chất liệu vải 100% Cotton 2 chiều định lượng 250gsm dày dặn, thấm hút mồ hôi cực tốt. Thiết kế form oversize phong cách đường phố năng động.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xám Tiêu', 'Xanh Rêu'],
    rating: 4.8,
    reviewsCount: 128,
    isFeatured: true,
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Áo Polo Nam Bo Dệt Cao Cấp Thoáng Khí',
    categoryId: 'cat-1',
    price: 290000,
    originalPrice: 350000,
    stock: 32,
    description: 'Polo pique gai cá sấu dệt tổ ong tinh xảo, cổ áo phối sọc lịch sự, form slim-fit tôn dáng công sở hoặc dạo phố cuối tuần.',
    image: 'https://images.unsplash.com/photo-1625910513413-5b879b6fb350?w=700&auto=format&fit=crop&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['Xanh Navy', 'Trắng', 'Đen'],
    rating: 4.9,
    reviewsCount: 84,
    isFeatured: true,
    createdAt: '2026-03-02T10:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Áo Sơ Mi Oxford Dài Tay Chống Nhăn Premium',
    categoryId: 'cat-2',
    price: 345000,
    originalPrice: 450000,
    stock: 28,
    description: 'Chất vải Oxford dệt thoi sợi kép, xử lý hoàn tất chống nhăn công nghệ mới giúp sơ mi luôn đứng phom suốt cả ngày làm việc.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng Tinh', 'Xanh Nhạt', 'Kẻ Caro Xanh'],
    rating: 4.7,
    reviewsCount: 65,
    isFeatured: true,
    createdAt: '2026-03-03T10:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Áo Sơ Mi Lụa Tay Cộc Cổ Cuba Họa Tiết Retro',
    categoryId: 'cat-2',
    price: 280000,
    originalPrice: 320000,
    stock: 19,
    description: 'Vải lụa tuyết rũ mát lạnh, họa tiết hoa lá vintage cổ điển, phối quần short hoặc quần tây rất bắt mắt cho các chuyến du lịch.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=700&auto=format&fit=crop&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['Xanh Họa Tiết', 'Be Cổ Điển'],
    rating: 4.6,
    reviewsCount: 42,
    createdAt: '2026-03-04T10:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Quần Jean Ống Suông Rộng Denim Nhật Bản',
    categoryId: 'cat-3',
    price: 450000,
    originalPrice: 590000,
    stock: 35,
    description: 'Chất liệu Denim cotton 13.5oz wash màu tự nhiên, chỉ may chắc chắn, cạp cao hack chân dài tuyệt đối, tôn dáng mọi vóc dáng.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80',
    sizes: ['29', '30', '31', '32'],
    colors: ['Xanh Nhạt', 'Xanh Đậm', 'Đen Khói'],
    rating: 4.9,
    reviewsCount: 156,
    isFeatured: true,
    createdAt: '2026-03-05T10:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Quần Kaki Chinos Co Giãn 4 Chiều Công Sở',
    categoryId: 'cat-3',
    price: 360000,
    originalPrice: 420000,
    stock: 40,
    description: 'Kaki pha sợi Spandex co giãn nhẹ 4 chiều thoải mái khi vận động hoặc ngồi làm việc nhiều giờ, đường may giấu chỉ tinh tế.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&auto=format&fit=crop&q=80',
    sizes: ['29', '30', '31', '32'],
    colors: ['Be Sáng', 'Đen', 'Xám Chì', 'Xanh Rêu'],
    rating: 4.7,
    reviewsCount: 91,
    createdAt: '2026-03-06T10:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Áo Khoác Blazer Nam Nữ Hàn Quốc 2 Lớp',
    categoryId: 'cat-4',
    price: 590000,
    originalPrice: 750000,
    stock: 22,
    description: 'Blazer dáng xuông phong cách Minimalist Hàn Quốc, đệm vai tinh xảo, lót lụa mềm mại bên trong, phù hợp cả đi làm lẫn đi tiệc.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L'],
    colors: ['Đen', 'Be Cát', 'Nâu Tây'],
    rating: 4.9,
    reviewsCount: 110,
    isFeatured: true,
    createdAt: '2026-03-07T10:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Áo Khoác Bomber Dù 2 Lớp Cản Gió Trượt Nước',
    categoryId: 'cat-4',
    price: 420000,
    originalPrice: 520000,
    stock: 18,
    description: 'Vải dù poly chống thấm nước nhẹ, cản gió giữ ấm hiệu quả, khóa kéo kim loại YKK cao cấp, bo gấu dày dặn không bai dão.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80',
    sizes: ['M', 'L', 'XL'],
    colors: ['Đen', 'Xanh Rêu', 'Xám'],
    rating: 4.6,
    reviewsCount: 73,
    createdAt: '2026-03-08T10:00:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Đầm Xòe Nữ Cổ Vuông Tay Bồng Duyên Dáng',
    categoryId: 'cat-5',
    price: 399000,
    originalPrice: 490000,
    stock: 15,
    description: 'Chất voan tơ cao cấp bồng bềnh, thiết kế cổ vuông khoe xương quai xanh quyến rũ, kèm dây buộc eo thắt nơ tôn dáng thon gọn.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L'],
    colors: ['Trắng Kem', 'Hồng Pastel', 'Đỏ Rượu'],
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: true,
    createdAt: '2026-03-09T10:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Chân Váy Chữ A Xếp Ly Kèm Quần Bảo Hộ',
    categoryId: 'cat-5',
    price: 230000,
    originalPrice: 280000,
    stock: 25,
    description: 'Chân váy tuyết mưa dày dặn không lo nhăn nhàu, thiết kế nếp gấp ly sắc sảo, may sẵn quần trong co giãn cực kỳ an tâm khi di chuyển.',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L'],
    colors: ['Đen', 'Xám', 'Nâu'],
    rating: 4.7,
    reviewsCount: 64,
    createdAt: '2026-03-10T10:00:00.000Z'
  },
  {
    id: 'prod-11',
    name: 'Nón Lưỡi Trai Kaki Thêu Logo Tối Giản',
    categoryId: 'cat-6',
    price: 120000,
    originalPrice: 160000,
    stock: 50,
    description: 'Mũ lưỡi trai phong cách Baseball cap chuẩn form, vải kaki cotton 100% thoáng đầu, khóa bấm kim loại phía sau dễ điều chỉnh kích thước.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&auto=format&fit=crop&q=80',
    sizes: ['Free size'],
    colors: ['Đen', 'Kem', 'Xanh Navy'],
    rating: 4.9,
    reviewsCount: 140,
    createdAt: '2026-03-11T10:00:00.000Z'
  },
  {
    id: 'prod-12',
    name: 'Thắt Lưng Da Bò Khóa Tự Động Sang Trọng',
    categoryId: 'cat-6',
    price: 260000,
    originalPrice: 350000,
    stock: 30,
    description: 'Dây lưng da bò tự nhiên 2 lớp bền bỉ, mặt khóa hợp kim không rỉ mạ titan bóng bẩy, cơ chế răng cưa khóa tự động chuẩn xác tiện lợi.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80',
    sizes: ['110cm', '120cm'],
    colors: ['Đen Vân Nhẵn', 'Nâu Cà Phê'],
    rating: 4.8,
    reviewsCount: 77,
    createdAt: '2026-03-12T10:00:00.000Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Quản Trị Viên (Admin)',
    email: 'admin@shop.vn',
    phone: '0901234567',
    role: 'admin',
    password: 'admin'
  },
  {
    id: 'usr-customer',
    name: 'Nguyễn Văn An',
    email: 'khachhang@gmail.com',
    phone: '0987654321',
    role: 'customer',
    password: '123'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-89412',
    userId: 'usr-customer',
    customerName: 'Nguyễn Văn An',
    customerEmail: 'khachhang@gmail.com',
    customerPhone: '0987654321',
    shippingAddress: '128 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    note: 'Giao giờ hành chính giúp tôi',
    items: [
      {
        id: 'prod-1-L-Trắng',
        productId: 'prod-1',
        name: 'Áo Thun Cổ Tròn Cotton 100% Phối Túi Vintage',
        price: 189000,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
        selectedSize: 'L',
        selectedColor: 'Trắng',
        quantity: 2,
        stock: 45
      },
      {
        id: 'prod-5-31-Xanh Đậm',
        productId: 'prod-5',
        name: 'Quần Jean Ống Suông Rộng Denim Nhật Bản',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80',
        selectedSize: '31',
        selectedColor: 'Xanh Đậm',
        quantity: 1,
        stock: 35
      }
    ],
    subtotal: 828000,
    shippingFee: 30000,
    totalAmount: 858000,
    paymentMethod: 'cod',
    isPaid: false,
    status: 'shipping',
    createdAt: '2026-03-15T14:20:00.000Z',
    updatedAt: '2026-03-16T09:30:00.000Z'
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-77123',
    userId: 'usr-customer',
    customerName: 'Trần Thị Mai',
    customerEmail: 'thimai.tran@gmail.com',
    customerPhone: '0912349988',
    shippingAddress: '45 Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội',
    note: '',
    items: [
      {
        id: 'prod-7-M-Be Cát',
        productId: 'prod-7',
        name: 'Áo Khoác Blazer Nam Nữ Hàn Quốc 2 Lớp',
        price: 590000,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80',
        selectedSize: 'M',
        selectedColor: 'Be Cát',
        quantity: 1,
        stock: 22
      }
    ],
    subtotal: 590000,
    shippingFee: 0,
    totalAmount: 590000,
    paymentMethod: 'bank_transfer',
    isPaid: true,
    status: 'delivered',
    createdAt: '2026-03-12T11:00:00.000Z',
    updatedAt: '2026-03-14T16:00:00.000Z'
  }
];
