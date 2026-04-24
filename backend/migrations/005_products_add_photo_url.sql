-- Migration: 005_products_add_photo_url
-- Tambah URL foto produk untuk ditampilkan di daftar produk/detail.

ALTER TABLE products
  ADD COLUMN photo_url VARCHAR(500) DEFAULT NULL AFTER barcode;
