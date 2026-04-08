import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, TextInput, FlatList, StatusBar
} from 'react-native';

const COLORS = {
  bg: '#0D0D0D',
  card: '#1A1A1A',
  accent: '#FF6B35',
  accentLight: '#FF8C5A',
  white: '#FFFFFF',
  gray: '#888888',
  lightGray: '#2A2A2A',
  success: '#4CAF50',
};

const PRODUCTS = [
  { id: '1', name: 'Air Max Pulse', brand: 'Nike', price: 149, category: 'Shoes', rating: 4.8, reviews: 234, color: '#FF6B35', emoji: '👟' },
  { id: '2', name: 'Classic Tee', brand: 'Essentials', price: 49, category: 'Tops', rating: 4.5, reviews: 189, color: '#6C63FF', emoji: '👕' },
  { id: '3', name: 'Slim Joggers', brand: 'Adidas', price: 89, category: 'Bottoms', rating: 4.7, reviews: 312, color: '#00BCD4', emoji: '👖' },
  { id: '4', name: 'Urban Jacket', brand: 'Zara', price: 199, category: 'Outerwear', rating: 4.9, reviews: 156, color: '#FF4081', emoji: '🧥' },
  { id: '5', name: 'Canvas Bag', brand: 'H&M', price: 39, category: 'Accessories', rating: 4.3, reviews: 98, color: '#8BC34A', emoji: '👜' },
  { id: '6', name: 'Sport Watch', brand: 'Casio', price: 129, category: 'Accessories', rating: 4.6, reviews: 275, color: '#FFC107', emoji: '⌚' },
];

const CATEGORIES = ['All', 'Shoes', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  if (screen === 'detail' && selectedProduct) {
    return <ProductDetail
      product={selectedProduct}
      onBack={() => setScreen('home')}
      onAddToCart={() => { addToCart(selectedProduct); setScreen('home'); }}
      isWishlisted={wishlist.includes(selectedProduct.id)}
      onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
    />;
  }

  if (screen === 'cart') {
    return <CartScreen
      cart={cart}
      total={cartTotal}
      onBack={() => setScreen('home')}
      onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
    />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Alex 👋</Text>
          <Text style={styles.headerTitle}>Find Your Style</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => setScreen('cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={COLORS.gray}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTag}>NEW SEASON</Text>
            <Text style={styles.bannerTitle}>Summer{'\n'}Collection</Text>
            <Text style={styles.bannerSub}>Up to 40% off</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>👗</Text>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <Text style={styles.sectionTitle}>
          {filteredProducts.length} Products Found
        </Text>
        <View style={styles.grid}>
          {filteredProducts.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => { setSelectedProduct(product); setScreen('detail'); }}
            >
              <View style={[styles.productImageBg, { backgroundColor: product.color + '22' }]}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
                <TouchableOpacity
                  style={styles.wishBtn}
                  onPress={() => toggleWishlist(product.id)}
                >
                  <Text>{wishlist.includes(product.id) ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>${product.price}</Text>
                  <Text style={styles.productRating}>⭐ {product.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductDetail({ product, onBack, onAddToCart, isWishlisted, onToggleWishlist }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={[styles.detailImageBg, { backgroundColor: product.color + '33' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailEmoji}>{product.emoji}</Text>
          <TouchableOpacity style={styles.wishBtnDetail} onPress={onToggleWishlist}>
            <Text style={{ fontSize: 24 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailContent}>
          <Text style={styles.detailBrand}>{product.brand}</Text>
          <Text style={styles.detailName}>{product.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailPrice}>${product.price}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {product.rating} ({product.reviews})</Text>
            </View>
          </View>

          <Text style={styles.sizeLabel}>Select Size</Text>
          <View style={styles.sizesRow}>
            {sizes.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(s)}
              >
                <Text style={[styles.sizeBtnText, selectedSize === s && styles.sizeBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.descLabel}>Description</Text>
          <Text style={styles.descText}>
            Premium quality {product.name} from {product.brand}. Crafted with sustainable materials for everyday comfort and style. Perfect for any occasion.
          </Text>

          <TouchableOpacity style={styles.addToCartBtn} onPress={onAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart — ${product.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CartScreen({ cart, total, onBack, onRemove }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 60 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={{ fontSize: 60 }}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.addToCartBtn} onPress={onBack}>
            <Text style={styles.addToCartText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={[styles.cartItemImg, { backgroundColor: item.color + '22' }]}>
                  <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                </View>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemBrand}>{item.brand}</Text>
                  <Text style={styles.cartItemPrice}>${item.price} × {item.qty}</Text>
                </View>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Text style={{ fontSize: 20 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.cartFooter}>
            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Total</Text>
              <Text style={styles.cartTotalAmount}>${total}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartBtn}>
              <Text style={styles.addToCartText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  greeting: { color: COLORS.gray, fontSize: 14 },
  headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  cartBtn: { position: 'relative', padding: 8 },
  cartIcon: { fontSize: 26 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.accent, borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, margin: 16, borderRadius: 14, paddingHorizontal: 14 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.white, height: 46, fontSize: 15 },
  banner: { margin: 16, backgroundColor: COLORS.lightGray, borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.accent + '44' },
  bannerTag: { color: COLORS.accent, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
  bannerTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800', lineHeight: 30, marginBottom: 6 },
  bannerSub: { color: COLORS.gray, fontSize: 14, marginBottom: 14 },
  bannerBtn: { backgroundColor: COLORS.accent, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, alignSelf: 'flex-start' },
  bannerBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  bannerEmoji: { fontSize: 72 },
  categoriesRow: { paddingLeft: 16, marginBottom: 8 },
  catChip: { backgroundColor: COLORS.lightGray, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, marginRight: 8 },
  catChipActive: { backgroundColor: COLORS.accent },
  catText: { color: COLORS.gray, fontWeight: '600', fontSize: 13 },
  catTextActive: { color: COLORS.white },
  sectionTitle: { color: COLORS.gray, fontSize: 13, marginLeft: 16, marginVertical: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  productCard: { width: '47%', margin: '1.5%', backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden' },
  productImageBg: { height: 140, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productEmoji: { fontSize: 64 },
  wishBtn: { position: 'absolute', top: 10, right: 10 },
  productInfo: { padding: 12 },
  productBrand: { color: COLORS.gray, fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  productName: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginTop: 2 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  productPrice: { color: COLORS.accent, fontSize: 16, fontWeight: '800' },
  productRating: { color: COLORS.gray, fontSize: 12 },
  detailImageBg: { height: 300, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  backBtn: { position: 'absolute', top: 20, left: 20 },
  backBtnText: { color: COLORS.accent, fontSize: 16, fontWeight: '600' },
  detailEmoji: { fontSize: 120 },
  wishBtnDetail: { position: 'absolute', top: 20, right: 20 },
  detailContent: { padding: 24 },
  detailBrand: { color: COLORS.gray, fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  detailName: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginTop: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  detailPrice: { color: COLORS.accent, fontSize: 28, fontWeight: '800' },
  ratingBadge: { backgroundColor: COLORS.lightGray, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  ratingText: { color: COLORS.white, fontSize: 13 },
  sizeLabel: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  sizesRow: { flexDirection: 'row', gap: 10 },
  sizeBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.lightGray, alignItems: 'center', justifyContent: 'center' },
  sizeBtnActive: { backgroundColor: COLORS.accent },
  sizeBtnText: { color: COLORS.gray, fontWeight: '700' },
  sizeBtnTextActive: { color: COLORS.white },
  descLabel: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 8 },
  descText: { color: COLORS.gray, fontSize: 14, lineHeight: 22 },
  addToCartBtn: { backgroundColor: COLORS.accent, borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 24 },
  addToCartText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, margin: 12, borderRadius: 16, padding: 14 },
  cartItemImg: { width: 70, height: 70, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cartItemInfo: { flex: 1 },
  cartItemName: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  cartItemBrand: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  cartItemPrice: { color: COLORS.accent, fontSize: 14, fontWeight: '700', marginTop: 4 },
  cartFooter: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  cartTotalLabel: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  cartTotalAmount: { color: COLORS.accent, fontSize: 24, fontWeight: '800' },
  emptyCart: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { color: COLORS.gray, fontSize: 18 },
});
