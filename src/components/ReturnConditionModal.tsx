import { useState } from "react";
import { X, CheckCircle, Package } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (condition: string, notes: string) => void;
  isSubmitting: boolean;
  itemTitle: string;
}

export function ReturnConditionModal({ isOpen, onClose, onConfirm, isSubmitting, itemTitle }: Props) {
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <Package className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Confirm Return</h2>
              <p className="text-sm font-medium text-gray-500 truncate max-w-[200px]">{itemTitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="size-10 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-gray-600 mb-6">
            Please confirm the condition of your item now that it has been returned.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Item Condition <span className="text-red-500">*</span></label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 font-medium focus:ring-2 focus:ring-brand-yellow appearance-none"
                disabled={isSubmitting}
              >
                <option value="like-new">Like New (Perfect condition)</option>
                <option value="good">Good (Normal wear and tear)</option>
                <option value="fair">Fair (Minor damage but usable)</option>
                <option value="damaged">Damaged (Requires repair)</option>
                <option value="lost">Lost / Not Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any issues? Missing parts? Was it cleaned?"
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 font-medium focus:ring-2 focus:ring-brand-yellow min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {(condition === "damaged" || condition === "lost") && (
            <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-sm text-red-800 font-medium leading-relaxed">
                <span className="font-bold">Note:</span> Marking this item as {condition} will record it in the rental agreement. If you need further assistance from the platform or want to file a claim, please use the <strong>Request Platform Help</strong> button on the Agreements page after confirming this return.
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(condition, notes)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Confirming..."
              ) : (
                <>
                  <CheckCircle className="size-5" /> Confirm Return
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
