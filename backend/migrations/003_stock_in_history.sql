-- Migration: 003_stock_in_history
-- Simpan histori stok masuk saat menambah stok produk existing.

CREATE TABLE IF NOT EXISTS stock_in_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  qty_before INT NOT NULL DEFAULT 0,
  qty_added INT UNSIGNED NOT NULL,
  qty_after INT NOT NULL DEFAULT 0,
  notes VARCHAR(500) DEFAULT NULL,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stock_in_history_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_stock_in_history_user
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  KEY idx_stock_in_history_product (product_id),
  KEY idx_stock_in_history_created_at (created_at)
) ENGINE=InnoDB;
