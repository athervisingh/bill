import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = (size: number) => (width / 375) * size;

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  discount: string;
  discountType: '%' | '₹';
  total: number;
}

interface ApiProduct {
  id: number;
  name: string;
  price: number;
}

interface ProductSectionProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onLineItemsChange?: (data: { lineItems: any[]; totalAmt: number }) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  setProducts,
  onLineItemsChange,
}) => {
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  // FlatList ref for scrollToIndex
  const flatListRef = useRef<FlatList<Product> | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://mkqfdpqq-3000.inc1.devtunnels.ms/products');
      const json = await res.json();
      if (res.status === 200 && json?.data) {
        const sorted = json.data.sort((a: ApiProduct, b: ApiProduct) =>
          a.name.localeCompare(b.name),
        );
        setAllProducts(sorted);
      } else {
        setAllProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: `PRD-${Date.now()}`,
        name: '',
        price: '',
        quantity: '',
        discount: '',
        discountType: '%',
        total: 0,
      },
    ]);
  };

  const syncParent = (updated: Product[]) => {
    if (!onLineItemsChange) return;
    const lineItems = updated.map((prod) => ({
      productId:
        allProducts.find((p) => p.name === prod.name)?.id ??
        (Number(prod.id) || null),
      productQuantity: Number(prod.quantity || 0),
      productAmountDiscount: prod.discountType === '₹' ? Number(prod.discount || 0) : 0,
      productPercentDiscount: prod.discountType === '%' ? Number(prod.discount || 0) : 0,
    }));
    const totalAmt = updated.reduce((sum, p) => sum + (p.total || 0), 0);
    onLineItemsChange({ lineItems, totalAmt });
  };

  const updateProduct = <K extends Exclude<keyof Product, 'id' | 'total'>>(
    index: number,
    field: K,
    value: Product[K],
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value } as Product;

    const p = updated[index];
    let total = Number(p.price || 0) * Number(p.quantity || 0);
    if (p.discount) {
      if (p.discountType === '%') total -= (total * Number(p.discount)) / 100;
      else total -= Number(p.discount);
    }
    updated[index].total = total;
    setProducts(updated);
    syncParent(updated);
  };

  const handleSelectProduct = (index: number, item: ApiProduct) => {
    const updated = [...products];
    updated[index].name = item.name;
    updated[index].price = String(item.price);
    updated[index].total =
      Number(item.price) * Number(updated[index].quantity || 1);
    // store backend id
    updated[index].id = String(item.id);
    setProducts(updated);
    setDropdownIndex(null);
    syncParent(updated);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    syncParent(updated);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={styles.cardContainer}>
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: scale(40) }}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Product {index + 1}</Text>

          <TouchableOpacity
            onPress={() => handleRemoveProduct(index)}
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#cbd5e1',
            marginVertical: 10,
          }}
        />

        {/* Product Name */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={[
              styles.input,
              item.name && { backgroundColor: '#e2e8f0' },
            ]}
            placeholder="Enter name"
            value={item.name}
            editable={!allProducts.some((p) => p.name === item.name)}
            onFocus={() => {
              if (!item.name) {
                fetchProducts();
                setDropdownIndex(index);
              }
            }}
            onChangeText={(t) => updateProduct(index, 'name', t)}
          />

          {dropdownIndex === index && (
            <View style={styles.dropdown}>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : allProducts.length === 0 ? (
                <Text style={styles.noData}>No products found</Text>
              ) : (
                <ScrollView
                  style={{ maxHeight: scale(250) }}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                >
                  {allProducts.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectProduct(index, p)}
                    >
                      <Text style={styles.dropdownText}>{p.name}</Text>
                      <Text style={styles.dropdownSub}>₹{p.price}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* Price */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={[
              styles.input,
              item.name && { backgroundColor: '#e2e8f0' },
            ]}
            keyboardType="numeric"
            placeholder="0"
            value={item.price}
            editable={!allProducts.some((p) => p.name === item.name)}
            onChangeText={(t) => updateProduct(index, 'price', t)}
          />
        </View>

        {/* Quantity */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            value={item.quantity}
            onChangeText={(t) => updateProduct(index, 'quantity', t)}
          />
        </View>

        {/* Discount */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            value={item.discount}
            onChangeText={(t) => updateProduct(index, 'discount', t)}
          />

          <View style={styles.discountRow}>
            <TouchableOpacity
              onPress={() => updateProduct(index, 'discountType', '%')}
              style={[
                styles.discountBtn,
                item.discountType === '%' && styles.discountSelected,
              ]}
            >
              <Text
                style={
                  item.discountType === '%'
                    ? styles.selectedText
                    : styles.unselectedText
                }
              >
                %
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateProduct(index, 'discountType', '₹')}
              style={[
                styles.discountBtn,
                item.discountType === '₹' && styles.discountSelected,
              ]}
            >
              <Text
                style={
                  item.discountType === '₹'
                    ? styles.selectedText
                    : styles.unselectedText
                }
              >
                ₹
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <Text style={styles.totalText}>Total: ₹{item.total.toFixed(2)}</Text>
      </ScrollView>
    </View>
  );

  const grandTotal = products.reduce((sum, p) => sum + (p.total || 0), 0);

  // Scroll to index for table Edit button
  const handleEditFromTable = (index: number) => {
    if (!flatListRef.current) return;
    if (index < 0 || index >= products.length) return;

    flatListRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // center ke kareeb
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Add Product</Text>

      <View style={styles.productsContainer}>
        <FlatList
          ref={flatListRef}
          data={products}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          snapToInterval={width}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
        <Text style={styles.addText}>+ Add Another Product</Text>
      </TouchableOpacity>

      <View style={styles.grandBox}>
        <Text style={styles.grandLabel}>Total:</Text>
        <Text style={styles.grandValue}>₹{grandTotal.toFixed(2)}</Text>
      </View>

      {/* TABLE OF PRODUCTS (LIST VIEW) */}
      {products.length > 0 && (
        <View style={{ marginHorizontal: scale(16), marginBottom: scale(20) }}>
          {/* Header row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: scale(6),
              paddingHorizontal: scale(6),
              borderRadius: scale(8),
              backgroundColor: '#e2e8f0',
            }}
          >
            <Text
              style={[styles.tableHeaderCell, { flex: 2.2 }]}
              numberOfLines={1}
            >
              Name
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Disc</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Total</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Edit</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Delete</Text>
          </View>

          <ScrollView
            style={{ maxHeight: height * 0.25, marginTop: scale(4) }}
            showsVerticalScrollIndicator={false}
          >
            {products.map((prod, index) => (
              <View key={prod.id} style={styles.tableRow}>
                <Text
                  style={[styles.tableCell, { flex: 2.2 }]}
                  numberOfLines={1}
                >
                  {prod.name || '-'}
                </Text>

                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                  {prod.quantity || '0'}
                </Text>

                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {prod.price || '0'}
                </Text>

                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {prod.discount || '0'}
                  {prod.discount ? prod.discountType : ''}
                </Text>

                <Text style={[styles.tableCell, { flex: 1.2 }]}>
                  {prod.total.toFixed(2)}
                </Text>

                <TouchableOpacity
                  style={[styles.tableActionBtn, { flex: 1 }]}
                  onPress={() => handleEditFromTable(index)}
                >
                  <Text style={styles.tableActionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tableActionBtn,
                    { flex: 1, borderColor: '#dc2626' },
                  ]}
                  onPress={() => handleRemoveProduct(index)}
                >
                  <Text
                    style={[styles.tableActionText, { color: '#dc2626' }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// STYLES
const styles = StyleSheet.create({
  header: {
    fontSize: scale(20),
    fontWeight: '700',
    marginLeft: scale(16),
    marginBottom: scale(12),
    color: '#1e293b',
  },
  productsContainer: { height: height * 0.7, marginBottom: scale(8) },
  cardContainer: { width, paddingHorizontal: scale(12), height: height * 20.5 },
  card: {
    backgroundColor: '#f8fafc',
    padding: scale(16),
    borderRadius: scale(12),
    flex: 1,
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    marginBottom: scale(12),
    color: '#1e293b',
  },
  inputBox: { marginBottom: scale(12), position: 'relative' },
  label: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#334155',
    marginBottom: scale(6),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: scale(15),
    color: '#000',
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  half: { width: '47%' },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(12),
    marginTop: scale(10),
  },
  discountBtn: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    backgroundColor: 'transparent',
  },
  discountSelected: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  selectedText: { color: '#000', fontWeight: '600' },
  unselectedText: { color: '#000', fontWeight: '500' },
  totalText: {
    textAlign: 'right',
    marginTop: scale(12),
    fontWeight: '700',
    fontSize: scale(16),
    color: '#000',
    marginRight: scale(20),
  },
  addBtn: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(10),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: '#888',
  },
  addText: { color: '#000', fontWeight: '600', fontSize: scale(15) },
  grandBox: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: scale(14),
    borderRadius: scale(10),
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#888',
  },
  grandLabel: { fontSize: scale(16), fontWeight: '600', color: '#000' },
  grandValue: { fontSize: scale(20), fontWeight: '700', color: '#000' },
  dropdown: {
    position: 'absolute',
    top: scale(68),
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: { fontSize: scale(15), fontWeight: '600', color: '#000' },
  dropdownSub: { fontSize: scale(13), color: '#666' },
  noData: { textAlign: 'center', padding: 10, color: '#777' },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(8),
    marginRight: scale(20),
  },
  removeText: {
    color: '#dc2626',
    fontSize: scale(13),
    fontWeight: '600',
  },

  // TABLE styles
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(6),
    paddingHorizontal: scale(6),
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  tableHeaderCell: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#0f172a',
  },
  tableCell: {
    fontSize: scale(11),
    color: '#000',
  },
  tableActionBtn: {
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: scale(6),
    paddingVertical: scale(4),
    paddingHorizontal: scale(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(4),
  },
  tableActionText: {
    fontSize: scale(10),
    fontWeight: '600',
    color: '#0f172a',
  },
});

export default ProductSection;
