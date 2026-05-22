import { AdminModal } from "./AdminModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: "danger" | "primary" | "warning";
}

export function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  confirmVariant = "primary" 
}: Props) {
  const getButtonStyles = () => {
    switch (confirmVariant) {
      case "danger": return "bg-red-600 text-white hover:bg-red-700";
      case "warning": return "bg-brand-yellow text-brand-black hover:bg-yellow-500";
      case "primary": default: return "bg-brand-black text-white hover:bg-gray-900";
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 font-medium mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-6 py-2.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className={`px-6 py-2.5 rounded-full font-bold transition-colors ${getButtonStyles()}`}>
          {confirmText}
        </button>
      </div>
    </AdminModal>
  );
}
