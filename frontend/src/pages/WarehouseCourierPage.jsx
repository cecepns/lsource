import { useEffect, useRef, useState } from 'react';
import { Truck } from 'lucide-react';
import { api, apiCall, toastApiError } from '../utils/api.js';

export default function WarehouseCourierPage() {
  const [code, setCode] = useState('');
  const [lastOk, setLastOk] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit() {
    const c = code.trim();
    if (!c) return;
    setLastOk(null);
    try {
      const res = await apiCall(api.post('/api/orders/mark-dikirim', { code: c }), {
        success: (data) => data?.data?.message || 'Status Dikirim',
        loading: 'Memproses…',
      });
      const d = res?.data;
      setLastOk(
        d?.order_no
          ? `Pesanan ${d.order_no}: ${d.message || 'Dikirim'} (${d.line_count ?? 0} baris)`
          : 'Berhasil'
      );
      setCode('');
      inputRef.current?.focus();
    } catch (e) {
      toastApiError(e);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <h1 className="page-title flex items-center gap-2">
          <Truck size={28} strokeWidth={2} className="icon-title" aria-hidden />
          Kurir gudang
        </h1>
      </div>

      <div className="card max-w-xl space-y-3">
        <p className="muted text-sm leading-relaxed">
          Scan barcode <strong>no. pesanan</strong> atau <strong>no. resi</strong>, atau ketik manual lalu Enter /
          klik tandai. Hanya pesanan status <strong>Diproses</strong> yang diubah menjadi <strong>Dikirim</strong>{' '}
          (mengatasi resi yang tidak kebaca di counter ekspedisi).
        </p>
        <div>
          <label htmlFor="courier-code">No pesanan atau resi</label>
          <input
            id="courier-code"
            ref={inputRef}
            className="mt-1 w-full"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="Scan / ketik…"
            autoComplete="off"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => void submit()}>
          Tandai dikirim
        </button>
        {lastOk ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {lastOk}
          </p>
        ) : null}
      </div>
    </div>
  );
}
