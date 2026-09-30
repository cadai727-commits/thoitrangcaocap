import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Mail, Lock, User as UserIcon, Phone, CheckCircle2, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    forgotPassword,
    setActiveTab
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.message);
    } else {
      if (result.user?.role === 'admin') {
        setActiveTab('admin');
      }
    }
  };

  const handleQuickLogin = (role: 'admin' | 'customer') => {
    setLoginError('');
    if (role === 'admin') {
      const res = login('admin@shop.vn', 'admin');
      if (res.success) {
        setActiveTab('admin');
      }
    } else {
      login('khachhang@gmail.com', '123');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setRegError('Vui lòng điền đầy đủ các trường thông tin.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu cần tối thiểu 6 ký tự để đảm bảo bảo mật.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    const result = register(regName, regEmail, regPhone, regPassword);
    if (!result.success) {
      setRegError(result.message);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) {
      setForgotError('Vui lòng nhập địa chỉ email đã đăng ký.');
      return;
    }
    // Simulate sending OTP
    setForgotStep(2);
    setForgotMessage(`Mã xác thực OTP gồm 6 chữ số đã được gửi đến ${forgotEmail} (Mã mô phỏng: 123456)`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotOtp || !forgotNewPassword) {
      setForgotError('Vui lòng nhập mã OTP và mật khẩu mới.');
      return;
    }
    if (forgotOtp.trim() !== '123456') {
      setForgotError('Mã xác thực không đúng. Hãy nhập 123456 để thử nghiệm.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Mật khẩu mới cần tối thiểu 6 ký tự.');
      return;
    }

    const res = forgotPassword(forgotEmail, forgotNewPassword);
    if (res.success) {
      setAuthModalMode('login');
      setLoginEmail(forgotEmail);
      setForgotStep(1);
      setForgotMessage('');
    } else {
      setForgotError(res.message);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden transition-all"
      >
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="pt-6 px-6 pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Hệ Thống Thành Viên & Quản Trị
            </span>
          </div>

          <div className="flex space-x-1 bg-zinc-100 p-1 rounded-xl">
            <button
              id="tab-login"
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setLoginError('');
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              id="tab-register"
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setRegError('');
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Đăng Ký
            </button>
            <button
              id="tab-forgot"
              type="button"
              onClick={() => {
                setAuthModalMode('forgot_password');
                setForgotError('');
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authModalMode === 'forgot_password'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Quên MK
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* 1. LOGIN MODE */}
          {authModalMode === 'login' && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-zinc-900">Chào Mừng Quay Trở Lại</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Đăng nhập để mua sắm hoặc truy cập bảng điều khiển Admin.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="email"
                      placeholder="admin@shop.vn hoặc email của bạn"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot_password')}
                      className="text-xs text-emerald-600 hover:underline font-medium"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Login Helpers for easy testing */}
              <div className="mt-6 pt-5 border-t border-zinc-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 text-center">
                  Đăng nhập nhanh kiểm thử (1 chạm)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-quick-login-admin"
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-amber-900 text-xs font-medium text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Vào vai Admin</div>
                      <div className="text-[11px] text-amber-700/80">admin@shop.vn</div>
                    </div>
                  </button>

                  <button
                    id="btn-quick-login-customer"
                    type="button"
                    onClick={() => handleQuickLogin('customer')}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-900 text-xs font-medium text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Vào vai Khách Hàng</div>
                      <div className="text-[11px] text-blue-700/80">khachhang@gmail.com</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. REGISTER MODE */}
          {authModalMode === 'register' && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-zinc-900">Đăng Ký Tài Khoản Mới</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Tạo tài khoản khách hàng để nhận ưu đãi và mua hàng dễ dàng.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Họ và tên của bạn
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-name"
                      type="text"
                      placeholder="Ví dụ: Lê Thị Thu"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-email"
                      type="email"
                      placeholder="tenban@gmail.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-phone"
                      type="tel"
                      placeholder="09xx xxx xxx"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Mật khẩu
                    </label>
                    <input
                      id="input-reg-password"
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nhập lại mật khẩu
                    </label>
                    <input
                      id="input-reg-confirm-password"
                      type="password"
                      placeholder="Nhập lại đúng mật khẩu"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full mt-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hoàn Tất Đăng Ký Tài Khoản</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. FORGOT PASSWORD (KHÔI PHỤC TÀI KHOẢN) */}
          {authModalMode === 'forgot_password' && (
            <div>
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Khôi Phục Tài Khoản</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  Nhập email đăng ký để nhận mã khôi phục và thiết lập mật khẩu mới.
                </p>
              </div>

              {forgotMessage && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  {forgotMessage}
                </div>
              )}

              {forgotError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  {forgotError}
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Địa chỉ Email cần khôi phục
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-forgot-email"
                        type="email"
                        placeholder="khachhang@gmail.com"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                    </div>
                  </div>

                  <button
                    id="btn-send-otp"
                    type="submit"
                    className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Gửi Mã Xác Thực Khôi Phục</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Mã xác thực OTP (Nhập: 123456)
                    </label>
                    <input
                      id="input-forgot-otp"
                      type="text"
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono tracking-widest text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Mật khẩu mới của bạn
                    </label>
                    <input
                      id="input-forgot-new-password"
                      type="password"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      value={forgotNewPassword}
                      onChange={e => setForgotNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>

                  <button
                    id="btn-submit-new-password"
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Mật Khẩu Mới & Đăng Nhập</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-800"
                  >
                    Quay lại bước nhập email
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
