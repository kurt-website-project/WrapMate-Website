import { useMemo, useState } from "react";
import { calculateWrapLength } from "@/lib/orders";
import { useOrders } from "@/providers/orders-store";
import { ClipboardList } from "lucide-react";

export default function Records() {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");

  const completed = useMemo(
    () => orders.filter((order) => order.status === "Completed"),
    [orders]
  );

  const rows = useMemo(() => {
    const query = search.toLowerCase();
    return completed.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.sku.toLowerCase().includes(query) ||
        order.item.toLowerCase().includes(query)
    );
  }, [completed, search]);

  const totalWrap = completed.reduce(
    (sum, order) =>
      sum +
      calculateWrapLength(order.width, order.height, order.protection) *
        order.quantity,
    0
  );
  const totalUnits = completed.reduce((sum, order) => sum + order.quantity, 0);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <p className="wrapmate-eyebrow">Table view</p>
          <h1>Packaging Records</h1>
          <p className="wrapmate-muted">
            Historical log of completed packaging runs.
          </p>
        </div>
      </div>

      <div className="order-stats order-stats-3">
        <div className="order-stat">
          <span>Completed runs</span>
          <strong>{completed.length}</strong>
        </div>
        <div className="order-stat">
          <span>Total units wrapped</span>
          <strong>{totalUnits}</strong>
        </div>
        <div className="order-stat">
          <span>Total wrap used (cm)</span>
          <strong>{Math.round(totalWrap * 100) / 100}</strong>
        </div>
      </div>

      <div className="orders-card">
        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Search record, SKU, or item..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>SKU / Item</th>
                <th className="wm-num">W (cm)</th>
                <th className="wm-num">H (cm)</th>
                <th className="wm-num">Protection (P)</th>
                <th className="wm-num">Wrap length L (cm)</th>
                <th className="wm-num">Qty</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.length > 0 ? (
                rows.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>
                      <div className="wm-sku-cell">
                        <span className="wm-sku-name">{order.item}</span>
                        <span className="wm-sku-code">{order.sku}</span>
                      </div>
                    </td>
                    <td className="wm-num">{order.width}</td>
                    <td className="wm-num">{order.height}</td>
                    <td className="wm-num">{order.protection.toFixed(1)}</td>
                    <td className="wm-num">
                      <strong>
                        {calculateWrapLength(
                          order.width,
                          order.height,
                          order.protection
                        )}
                      </strong>
                    </td>
                    <td className="wm-num">{order.quantity}</td>
                    <td>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-orders">
                    <div className="wm-empty-inline">
                      <ClipboardList size={28} />
                      <span>
                        No completed packaging runs yet. Completed orders from
                        the Order Queue will appear here.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
