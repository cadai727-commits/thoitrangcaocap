import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckSquare, Square, RotateCcw, Filter, Tag, DollarSign, Check } from 'lucide-react';
import { formatVND } from '../utils/format';

interface CustomerFilterSidebarProps {
  onCloseMobile?: () => void;
}

export const CustomerFilterSidebar: React.FC<CustomerFilterSidebarProps> = ({ onCloseMobile }) => {
  const {
    categories,
    products,
    selectedCategoryIds,
    toggleCategoryFilter,
    clearCategoryFilter,
    priceFilter,
    setPriceFilter,
    searchTerm,
    setSearchTerm
  } = useStore();

  const [customMin, setCustomMin] = useState(priceFilter.min.toString());
  const [customMax, setCustomMax] = useState(priceFilter.max.toString());

  // Count products per category
  const getCategoryCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  const PRESET_PRICE_RANGES = [
    { label: 'Tất cả mức giá', min: 0, max: 2000000 },
    { label: 'Dưới 200.000₫', min: 0, max: 200000 },
    { label: '200.000₫ - 400.000₫', min: 200000, max: 400000 },
    { label: '400.000₫ - 600.000₫', min: 400000, max: 600000 },
    { label: 'Trên 600.000₫', min: 600000, max: 2000000 }
  ];

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = Math.max(0, parseInt(customMin) || 0);
    const maxVal = Math.max(minVal, parseInt(customMax) || 2000000);
    setPriceFilter({ min: minVal, max: maxVal });
  };

  const handleSelectPresetPrice = (min: number, max: number) => {
    setCustomMin(min.toString());
    setCustomMax(max.toString());
    setPriceFilter({ min, max });
  };

  const handleResetAll = () => {
    clearCategoryFilter();
    setPriceFilter({ min: 0, max: 2000000 });
    setCustomMin('0');
    setCustomMax('2000000');
    setSearchTerm('');
  };

  const isFiltered =
    selectedCategoryIds.length > 0 ||
    priceFilter.min > 0 ||
    priceFilter.max < 2000000 ||
    searchTerm.trim().length > 0;

  return (
    <aside className="w-full bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-900" />
          <h2 className="text-base font-bold text-zinc-900">Bộ Lọc Sản Phẩm</h2>
        </div>

        {isFiltered && (
          <button
            id="btn-reset-filters"
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* 1. Category Checkboxes (Requirement: Khách hàng cần Hiển Thị danh mục sản phẩm khi tích vào ô danh mục) */}
      <div className="py-4 border-b border-zinc-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Danh Mục Sản Phẩm</span>
          </div>
          {selectedCategoryIds.length > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Đã chọn {selectedCategoryIds.length}
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-500 mb-3">
          Tích vào ô để lọc hiển thị các sản phẩm thuộc danh mục bạn muốn:
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {categories.map(cat => {
            const isChecked = selectedCategoryIds.includes(cat.id);
            const count = getCategoryCount(cat.id);

            return (
              <label
                key={cat.id}
                id={`category-checkbox-label-${cat.id}`}
                className={`flex items-center justify-between p-2 rounded-xl text-sm transition-colors cursor-pointer border select-none ${
                  isChecked
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                    : 'border-transparent hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    id={`checkbox-cat-${cat.id}`}
                    checked={isChecked}
                    onChange={() => toggleCategoryFilter(cat.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'border border-zinc-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono shrink-0 ml-2">
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Filter (Requirement: Khách hàng cần lọc được sản phẩm theo giá cả) */}
      <div className="py-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lọc Theo Khoảng Giá</span>
        </div>

        {/* Preset Ranges */}
        <div className="space-y-1.5 mb-4">
          {PRESET_PRICE_RANGES.map((preset, idx) => {
            const isSelected =
              priceFilter.min === preset.min && priceFilter.max === preset.max;
            return (
              <button
                key={idx}
                id={`btn-price-preset-${idx}`}
                type="button"
                onClick={() => handleSelectPresetPrice(preset.min, preset.max)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-medium shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <span className="text-[10px] opacity-75">Đang chọn</span>}
              </button>
            );
          })}
        </div>

        {/* Custom Min - Max Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="space-y-3 pt-3 border-t border-zinc-100">
          <div className="text-xs font-medium text-zinc-600">Hoặc tự nhập khoảng giá (₫):</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Từ:</label>
              <input
                id="input-filter-price-min"
                type="number"
                min="0"
                step="10000"
                value={customMin}
                onChange={e => setCustomMin(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Đến:</label>
              <input
                id="input-filter-price-max"
                type="number"
                min="0"
                step="10000"
                value={customMax}
                onChange={e => setCustomMax(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="2000000"
              />
            </div>
          </div>

          <button
            id="btn-apply-custom-price"
            type="submit"
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Áp Dụng Khoảng Giá
          </button>
        </form>
      </div>

      {onCloseMobile && (
        <div className="mt-4 pt-4 border-t border-zinc-100 lg:hidden">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold"
          >
            Xem Kết Quả
          </button>
        </div>
      )}
    </aside>
  );
};
