import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api, apiCall, toastApiError } from '../utils/api.js';
import { confirmAction } from '../utils/confirm.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import PaginationBar from '../components/PaginationBar.jsx';
import UserFormModal from '../components/UserFormModal.jsx';

const LIMIT = 10;

export default function UsersPage() {
  const { isOwner, user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, 1000);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    const { data } = await api.get('/api/users', { params: { page, limit: LIMIT, search } });
    setRows(data.data);
    setTotal(data.total);
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (!isOwner) return;
    fetchUsers().catch((e) => toastApiError(e));
  }, [fetchUsers, isOwner]);

  if (!isOwner) return <Navigate to="/" replace />;

  async function handleDelete(id) {
    const ok = await confirmAction({ message: 'Hapus user ini?', confirmLabel: 'Hapus' });
    if (!ok) return;
    try {
      await apiCall(api.delete(`/api/users/${id}`), {
        success: 'User dihapus',
        loading: 'Menghapus…',
      });
      setRows((r) => r.filter((x) => x.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      /* toast */
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <h1 className="page-title flex items-center gap-2">
          <Users size={28} strokeWidth={2} className="icon-title" aria-hidden />
          User & akses
        </h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingUser(null);
            setUserModalOpen(true);
          }}
        >
          <Plus size={18} strokeWidth={2} aria-hidden />
          Tambah user
        </button>
      </div>

      <div className="card mb-4">
        <label>Cari </label>
        <input className="mt-1.5" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      </div>

      <div className="card table-wrap">
        <table className="table-app">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      className="btn btn-ghost min-h-9 px-2.5 text-xs"
                      onClick={() => {
                        setEditingUser(u);
                        setUserModalOpen(true);
                      }}
                    >
                      <Pencil size={14} strokeWidth={2} aria-hidden />
                      Edit
                    </button>
                    {u.id !== user?.id && (
                      <button
                        type="button"
                        className="btn btn-danger min-h-9 px-2.5 text-xs"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden />
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="muted p-4">Tidak ada data</p>}
      </div>

      <PaginationBar page={page} total={total} limit={LIMIT} onPageChange={setPage} />

      <UserFormModal
        open={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
        onSaved={fetchUsers}
      />
    </div>
  );
}
