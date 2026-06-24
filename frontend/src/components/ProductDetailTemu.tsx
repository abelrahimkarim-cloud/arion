'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface SizeOption {
  label: string;
  available: boolean;
  stock: number;
}

interface ColorVariation {
  label: string;
  slug: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  sizes: SizeOption[];
}

interface Product {
  name: string;
  description: string;
  defaultPrice: number;
  defaultSalePrice?: number;
  sku: string;
  category: string;
  variations: ColorVariation[];
  related: { name: string; slug: string }[];
}

interface ProductDetailTemuProps {
  product: Product;
  onAddToCart?: (color: string, size: string, quantity: number) => void;
}

export default function ProductDetailTemu({ product, onAddToCart }: ProductDetailTemuProps) {
  const [selectedColor, setSelectedColor] = useState<string>(product.variations[0]?.slug || '');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariation = useMemo(() => {
    return product.variations.find((v) => v.slug === selectedColor) || product.variations[0];
  }, [selectedColor, product.variations]);

  const galleryImages = useMemo(() => {
    if (!selectedVariation?.images) return [];
    return selectedVariation.images;
  }, [selectedVariation]);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(null);
  }, [selectedVariation]);

  const currentPrice =
    selectedVariation?.salePrice ?? selectedVariation?.price ?? product.defaultPrice;
  const originalPrice = selectedVariation?.price ?? product.defaultPrice;
  const discountPercent = selectedVariation?.salePrice
    ? Math.round((1 - selectedVariation.salePrice / selectedVariation.price!) * 100)
    : 0;

  const stockStatus = useMemo(() => {
    const stock = selectedVariation?.stock || 0;
    if (stock === 0) return { label: 'Out of stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stock <= 5)
      return { label: `Only ${stock} left`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { label: 'In stock', color: 'text-green-600', bgColor: 'bg-green-50' };
  }, [selectedVariation?.stock]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    onAddToCart?.(selectedColor, selectedSize, quantity);
  };

  const handleColorChange = (variation: ColorVariation) => {
    setSelectedColor(variation.slug);
  };

  const activeImage = galleryImages[activeImageIndex] || '';

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Main product section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Image gallery */}
          <div className="space-y-4 order-2 lg:order-1">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-square w-full bg-slate-100">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={`${product.name} - ${selectedVariation?.label}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Image unavailable
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    type="button"
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      activeImageIndex === index
                        ? 'border-orange-500 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Order panel */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Product header */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              {/* Category & SKU */}
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {product.category}
                </span>
                <span className="text-xs text-slate-500">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-orange-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-500">(2.5K reviews)</span>
              </div>

              {/* Price section */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-bold text-orange-600">
                  ${currentPrice.toFixed(2)}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div
                className={`inline-flex items-center gap-2 rounded-lg ${stockStatus.bgColor} px-3 py-2`}
              >
                <span className={`text-sm font-semibold ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              {/* Promo badges */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="text-slate-700">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="text-slate-700">Limited time offer - Ends in 2 days</span>
                </div>
              </div>
            </div>

            {/* Combined Selection Card: Color, Size, Quantity */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6 border-2 border-orange-200">
              {/* Color selector with image thumbnails */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Color: <span className="text-orange-600">{selectedVariation?.label}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map((variation) => {
                    const disabled = variation.stock === 0;
                    const active = selectedVariation?.slug === variation.slug;
                    const mainImage = variation.images?.[0];
                    return (
                      <button
                        key={variation.slug}
                        type="button"
                        onClick={() => handleColorChange(variation)}
                        disabled={disabled}
                        className={`flex flex-col items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                          disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        aria-pressed={active}
                        aria-label={`${variation.label} color${disabled ? ' (out of stock)' : ''}`}
                      >
                        {/* Color thumbnail with border indicator */}
                        <div
                          className={`h-16 w-16 rounded-lg border-2 overflow-hidden transition ${
                            active
                              ? 'border-orange-500 shadow-md'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={variation.label}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                        {/* Color label */}
                        <span
                          className={`text-xs font-semibold ${
                            active ? 'text-orange-600' : 'text-slate-700'
                          }`}
                        >
                          {variation.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200" />

              {/* Size selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900">Taille (Size)</label>
                  <button
                    type="button"
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    aria-label="Size guide"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {selectedVariation?.sizes.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => size.available && setSelectedSize(size.label)}
                      disabled={!size.available}
                      className={`rounded-lg border-2 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        selectedSize === size.label
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : size.available
                            ? 'border-slate-300 bg-white text-slate-900 hover:border-orange-300'
                            : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      aria-pressed={selectedSize === size.label}
                      aria-label={`${size.label}${!size.available ? ' (unavailable)' : ''}`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200" />

              {/* Quantity selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900">Qty</label>
                <div className="flex items-center gap-3 w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-300 hover:border-orange-300 hover:text-orange-600 transition font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-2 border-slate-300 rounded-lg py-2 font-semibold focus:border-orange-500 focus:outline-none"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-300 hover:border-orange-300 hover:text-orange-600 transition font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedVariation?.stock === 0 || !selectedSize}
              className={`w-full rounded-2xl py-4 text-lg font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                selectedVariation?.stock === 0 || !selectedSize
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 focus:ring-orange-400 shadow-lg'
              }`}
              aria-label={`Add ${quantity} item${quantity > 1 ? 's' : ''} to cart`}
            >
              {selectedVariation?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Payment & Guarantee badges */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="font-semibold text-slate-900">Secure Payment</p>
                    <p className="text-xs text-slate-600">SSL encrypted checkout</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-slate-900">30-Day Money Back</p>
                    <p className="text-xs text-slate-600">100% satisfaction guarantee</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📦</span>
                  <div>
                    <p className="font-semibold text-slate-900">Free Returns</p>
                    <p className="text-xs text-slate-600">Easy returns within 30 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
