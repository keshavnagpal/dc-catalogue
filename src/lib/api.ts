import Papa from 'papaparse';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS_CSV_URL, GITHUB_USER, GITHUB_REPO, GITHUB_BRANCH } from './config';
import type { Product } from './types';

export async function fetchProducts(): Promise<Product[]> {
  let csvText = '';

  try {
    // Try to fetch from remote URL if it's not the placeholder
    if (PRODUCTS_CSV_URL && !PRODUCTS_CSV_URL.includes('REPLACE_WITH')) {
      const response = await fetch(PRODUCTS_CSV_URL);
      if (response.ok) {
        csvText = await response.text();
      } else {
        console.warn('Remote CSV fetch failed. Falling back to local mock data.');
      }
    }
  } catch (error) {
    console.error('Error fetching remote CSV. Falling back to local mock data.', error);
  }

  // Fallback to local mock data if csvText is empty
  if (!csvText) {
    try {
      const mockCsvPath = path.join(process.cwd(), 'public', 'mock-data.csv');
      if (fs.existsSync(mockCsvPath)) {
        csvText = fs.readFileSync(mockCsvPath, 'utf-8');
      } else {
        console.warn('Mock CSV not found. Returning empty array.');
        return [];
      }
    } catch (e) {
      console.error('Error reading local mock CSV:', e);
      return [];
    }
  }

  // Parse CSV
  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row: any) => {
    const sku = row.sku?.trim() || '';
    return {
      sku,
      title: row.title?.trim() || 'Untitled',
      category: row.category?.trim() || 'Uncategorized',
      price: parseFloat(row.price) || 0,
      stock: parseInt(row.stock, 10) || 0,
      status: row.status?.trim() === 'active' ? 'active' : 'inactive',
      featured: row.featured?.trim().toLowerCase() === 'yes',
      description: row.description?.trim() || '',
      images: discoverImagesForSKU(sku),
    };
  }).filter(p => p.sku !== '');
}

export function discoverImagesForSKU(sku: string): string[] {
  if (!sku) return [];
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products', sku);
  
  if (!fs.existsSync(imagesDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(imagesDir);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    return files
      .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
      .sort() // Ensure consistent ordering
      .map(file => {
        // Construct jsDelivr URL
        if (GITHUB_USER.includes('REPLACE_WITH')) {
           // Fallback to local path if GitHub config is not set up
           return `/images/products/${sku}/${file}`;
        }
        return `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/public/images/products/${sku}/${file}`;
      });
  } catch (error) {
    console.error(`Error reading images for SKU ${sku}:`, error);
    return [];
  }
}
