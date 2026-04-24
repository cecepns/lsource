import Modal from './Modal.jsx';

export default function ImagePreviewModal({ open, onClose, src, title = 'Preview gambar' }) {
  if (!src) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="3xl">
      <div className="flex min-h-[18rem] items-center justify-center">
        <img
          src={src}
          alt={title}
          className="max-h-[70vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain"
        />
      </div>
    </Modal>
  );
}
