import { useEffect, useState } from 'react';
import { api, toastApiError } from '../utils/api.js';
import { toBackendUrl } from '../utils/endpoints.js';
import Modal from './Modal.jsx';
import ImagePreviewModal from './ImagePreviewModal.jsx';

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

function typeLabel(item) {
  if (item.type === 'stock_in') return 'Stok Masuk';
  if (item.type === 'audit') return 'Audit Stok';
  return item.order_status === 'retur' ? 'Retur' : 'Stok Keluar';
}

function qtyClass(item) {
  if (item.type === 'stock_in') return 'text-emerald-700';
  if (item.type === 'audit') return item.qty_delta >= 0 ? 'text-emerald-700' : 'text-red-700';
  return item.order_status === 'retur' ? 'text-emerald-700' : 'text-red-700';
}

function qtyText(item) {
  if (item.type === 'stock_in') return `+${item.qty_delta}`;
  if (item.type === 'audit') return item.qty_delta > 0 ? `+${item.qty_delta}` : String(item.qty_delta);
  if (item.order_status === 'retur') return `+${item.qty_delta}`;
  return `-${item.qty_delta}`;
}

export default function ProductHistoryModal({ open, onClose, productId }) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [rows, setRows] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    api
      .get(`/api/products/${productId}/stock-history`)
      .then(({ data }) => {
        setProduct(data.product || null);
        setRows(Array.isArray(data.history) ? data.history : []);
      })
      .catch((e) => {
        toastApiError(e);
        onClose();
      })
      .finally(() => setLoading(false));
  }, [open, productId, onClose]);

  return (
    <>
      <Modal open={open} onClose={onClose} title={product?.name ? `Histori ${product.name}` : 'Histori produk'} size="3xl">
      {loading ? (
        <p className="muted py-8 text-center">Memuat histori…</p>
      ) : (
        <div className="space-y-4">
          {product && (
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              {product.photo_url ? (
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <button
                    type="button"
                    className="block h-full w-full"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <img
                      src={toBackendUrl(product.photo_url)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs text-slate-400">
                  No Photo
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="break-words font-semibold leading-snug text-slate-900">{product.name}</div>
                <div className="muted text-sm">{product.barcode || 'Tanpa barcode'}</div>
                <div className="mt-1 text-sm text-slate-700">Stok saat ini: <strong>{Number(product.stock) || 0}</strong></div>
              </div>
            </div>
          )}

          {!rows.length && <p className="muted py-3 text-sm">Belum ada histori pergerakan stok.</p>}
          {!!rows.length && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="table-app">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Tipe</th>
                    <th>Keterangan</th>
                    <th className="text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={`${r.type}-${r.ref_id}`}>
                      <td>{formatDateTime(r.happened_at)}</td>
                      <td>{typeLabel(r)}</td>
                      <td className="text-sm">
                        {r.type === 'stock_out' && (
                          <span>
                            {r.order_no ? `Order ${r.order_no}` : 'Order'}{r.store_name ? ` · ${r.store_name}` : ''}
                          </span>
                        )}
                        {r.type !== 'stock_out' && <span>{r.created_by_name || 'System'}</span>}
                        {r.notes ? <span className="muted block">{r.notes}</span> : null}
                      </td>
                      <td className={`text-right tabular-nums font-semibold ${qtyClass(r)}`}>{qtyText(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </Modal>
      <ImagePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={product?.photo_url ? toBackendUrl(product.photo_url) : ''}
        title={product?.name || 'Preview gambar'}
      />
    </>
  );
}
