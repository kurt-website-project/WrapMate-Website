import { useState } from "react";
import {
  calculateWrapLength,
  PROTECTION_LEVELS,
  type ProtectionLevel,
} from "@/lib/orders";
import { useOrders } from "@/providers/orders-store";
import { X } from "lucide-react";

type AddOrderDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AddOrderDialog({ open, onClose }: AddOrderDialogProps) {
  const { addOrder } = useOrders();

  const [item, setItem] = useState("");
  const [sku, setSku] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [protection, setProtection] = useState<ProtectionLevel>(1);
  const [quantity, setQuantity] = useState("1");

  if (!open) {
    return null;
  }

  const widthNumber = parseFloat(width) || 0;
  const heightNumber = parseFloat(height) || 0;
  const previewLength =
    widthNumber > 0 && heightNumber > 0
      ? calculateWrapLength(widthNumber, heightNumber, protection)
      : null;

  function resetForm() {
    setItem("");
    setSku("");
    setWidth("");
    setHeight("");
    setProtection(1);
    setQuantity("1");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addOrder({
      item: item.trim(),
      sku: sku.trim().toUpperCase(),
      width: widthNumber,
      height: heightNumber,
      protection,
      quantity: parseInt(quantity, 10) || 1,
    });

    resetForm();
    onClose();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <div
      className="wm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Add order"
      onClick={handleClose}
    >
      <div className="wm-modal" onClick={(event) => event.stopPropagation()}>
        <div className="wm-modal-header">
          <div>
            <h2>Add order</h2>
            <p className="wrapmate-muted">
              Enter box dimensions to calculate the required bubble wrap length.
            </p>
          </div>
          <button
            type="button"
            className="wm-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className="wm-order-form" onSubmit={handleSubmit}>
          <div className="wm-field">
            <label htmlFor="order-item">Item name</label>
            <input
              id="order-item"
              type="text"
              placeholder="e.g. Phone Case Box"
              value={item}
              onChange={(event) => setItem(event.target.value)}
              required
            />
          </div>

          <div className="wm-field">
            <label htmlFor="order-sku">SKU</label>
            <input
              id="order-sku"
              type="text"
              placeholder="e.g. PH-CASE-01"
              value={sku}
              onChange={(event) => setSku(event.target.value)}
              required
            />
          </div>

          <div className="wm-field-row">
            <div className="wm-field">
              <label htmlFor="order-width">Box width W (cm)</label>
              <input
                id="order-width"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                required
              />
            </div>

            <div className="wm-field">
              <label htmlFor="order-height">Box height H (cm)</label>
              <input
                id="order-height"
                type="number"
                min="0"
                step="0.1"
                placeholder="0"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="wm-field-row">
            <div className="wm-field">
              <label htmlFor="order-protection">Protection level (P)</label>
              <select
                id="order-protection"
                value={protection}
                onChange={(event) =>
                  setProtection(Number(event.target.value) as ProtectionLevel)
                }
              >
                {PROTECTION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.toFixed(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="wm-field">
              <label htmlFor="order-quantity">Quantity</label>
              <input
                id="order-quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="wm-length-preview">
            <span>Required bubble wrap length (L)</span>
            <strong>
              {previewLength !== null ? `${previewLength} cm` : "—"}
            </strong>
            <small className="wrapmate-muted">
              L = (2 x (W + H) x P) + 5 cm allowance
            </small>
          </div>

          <div className="wm-modal-actions">
            <button
              type="button"
              className="wm-secondary-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="wrapmate-primary-button">
              Add order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
