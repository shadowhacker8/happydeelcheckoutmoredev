import type { Product } from '../types/product';

// Pre-load all products at module level
const productModules = import.meta.glob('../products/*/product.json', { 
  eager: true,
  import: 'default'
});

// Convert modules to products once at initialization
const allProducts = Object.entries(productModules).map(([path, module]) => {
  const slug = path.split('/')[2];
  return {
    id: slug,
    slug,
    ...(module as any)
  };
});

// Cache products in memory
let productsCache: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (productsCache) {
    return productsCache;
  }
  
  productsCache = allProducts;
  return productsCache;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!productsCache) {
    await getProducts();
  }
  return productsCache?.find(product => product.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!productsCache) {
    await getProducts();
  }
  return (productsCache || [])
    .sort((a, b) => b.slug.localeCompare(a.slug))
    .slice(0, 3);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  if (!productsCache) {
    await getProducts();
  }
  
  const currentProduct = productsCache?.find(p => p.slug === slug);
  
  if (!currentProduct) return [];
  
  return (productsCache || [])
    .filter(product => 
      product.category === currentProduct.category && 
      product.slug !== slug
    )
    .slice(0, 3);
}