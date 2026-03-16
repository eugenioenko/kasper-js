import { signal, computed } from 'kasper-js';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  material: string;
  department: string;
  company: string;
  createdAt: string;
}

const API_URL = 'https://69b23f3de06ef68ddd946d85.mockapi.io/products';

export const products = signal<Product[]>([]);
export const isLoading = signal(false);
export const error = signal<string | null>(null);

export async function fetchProducts() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    products.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

export async function addProduct(data: Partial<Product>) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const newProduct = await res.json();
    products.value = [newProduct, ...products.value];
  } catch (e: any) {
    console.error('Add failed:', e);
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Update failed');
    const updated = await res.json();
    
    // Update local state immediately
    products.value = products.value.map(p => p.id === id ? updated : p);
  } catch (e: any) {
    console.error('Update failed:', e);
  }
}

export async function deleteProduct(id: string) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    products.value = products.value.filter(p => p.id !== id);
  } catch (e: any) {
    console.error('Delete failed:', e);
  }
}
