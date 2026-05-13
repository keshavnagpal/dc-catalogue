# Premium Jewellery Catalogue

A production-ready static jewellery catalogue website built with Astro and TailwindCSS. Data is powered by a Google Sheets CSV.

## Features
- **Static Site Generation:** Lightning fast, zero backend required.
- **Google Sheets CMS:** Fetch product data from a published CSV at build time.
- **Automatic Image Discovery:** Automatically maps images in `public/images/products/[SKU]/` to the correct product.
- **WhatsApp Integration:** Direct order inquiries via WhatsApp.
- **GitHub Actions:** Auto-deployment to GitHub Pages.

## Data Source (Google Sheets CSV)

1. Create a Google Sheet with the following columns:
   - `sku`: Unique ID (e.g., AJ001)
   - `title`: Product name
   - `category`: Product category
   - `price`: Number (e.g., 2499)
   - `stock`: Number (0 for Sold Out)
   - `status`: `active` or `inactive`
   - `featured`: `yes` or `no`
   - `description`: Text description
2. Click **File -> Share -> Publish to web**. Choose "Comma-separated values (.csv)".
3. Copy the link and update `PRODUCTS_CSV_URL` in `src/lib/config.ts`.

## Image Structure

Place your images in `public/images/products/`:

```
public/
  images/
    products/
      AJ001/
        1.jpg
        2.jpg
      AJ002/
        main.jpg
```
The build process will automatically attach these images to the matching SKU.

## Development

```bash
npm install
npm run dev
```

## Deployment
Pushing to the `main` branch automatically triggers a build and deploys to GitHub Pages via the included GitHub Actions workflow.
