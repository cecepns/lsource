-- Tambah role owner & checker_pengiriman (MySQL ENUM perlu menyebut semua nilai).
ALTER TABLE users
  MODIFY COLUMN role ENUM('owner', 'admin', 'karyawan', 'checker_pengiriman')
  NOT NULL DEFAULT 'karyawan';

-- Admin lama diperlakukan seperti owner (akses penuh); admin baru dibuat lewat UI owner = aturan terbatas.
UPDATE users SET role = 'owner' WHERE role = 'admin';
