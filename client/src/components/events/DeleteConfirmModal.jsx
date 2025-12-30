import { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Event",
  itemName = "",
  itemType = "event",
  message = null,
  warningMessage = null,
  confirmText = "Delete",
  cancelText = "Cancel",
  requireConfirmation = false,
  confirmationPhrase = "DELETE"
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    // Check if confirmation text is required and matches
    if (requireConfirmation && confirmInput !== confirmationPhrase) {
      setError(`Please type "${confirmationPhrase}" to confirm`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while deleting
    setConfirmInput('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleConfirm();
    }
  };

  // Default messages if not provided
  const defaultMessage = message || `Are you sure you want to delete ${itemName ? `"${itemName}"` : `this ${itemType}`}? This action cannot be undone.`;
  const defaultWarning = warningMessage || `All associated data including RSVPs and attendee information will be permanently deleted.`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={title}
      size="medium"
    >
      <div className="space-y-6">
        {/* Warning Icon and Header */}
        <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">
              Warning: This action is permanent
            </h3>
            <p className="text-sm text-red-700 mt-1">
              This operation cannot be reversed
            </p>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            {defaultMessage}
          </p>
          
          {/* Additional Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> {defaultWarning}
            </p>
          </div>
        </div>

        {/* Item Details (if provided) */}
        {itemName && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              {itemType.charAt(0).toUpperCase() + itemType.slice(1)} to be deleted:
            </h4>
            <p className="text-gray-900 font-medium">{itemName}</p>
          </div>
        )}

        {/* Confirmation Input (optional) */}
        {requireConfirmation && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type <span className="font-bold text-red-600">{confirmationPhrase}</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => {
                setConfirmInput(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={confirmationPhrase}
              disabled={loading}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2
                ${error 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                }
                disabled:bg-gray-100 disabled:cursor-not-allowed
              `}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {/* Cancel Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className="
              flex-1 px-4 py-2.5 
              bg-gray-100 hover:bg-gray-200 
              text-gray-700 font-medium rounded-lg
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-gray-400
            "
          >
            {cancelText}
          </button>

          {/* Delete Button */}
          <button
            onClick={handleConfirm}
            disabled={loading || (requireConfirmation && confirmInput !== confirmationPhrase)}
            className="
              flex-1 px-4 py-2.5 
              bg-red-600 hover:bg-red-700 active:bg-red-800
              text-white font-semibold rounded-lg
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={20} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This action will take effect immediately and cannot be undone
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;