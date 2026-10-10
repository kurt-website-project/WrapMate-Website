import { useMemo, useState } from "react";
import { calculateWrapLength, type OrderStatus } from "@/lib/orders";
import { useOrders } from "@/providers/orders-store";
import { AddOrderDialog } from "@/components/add-order-dialog";
import { Plus } from "lucide-react";

export default function Orders() {
  const { orders, updateStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.sku.toLowerCase().includes(query) ||
        order.item.toLowerCase().includes(query);

      const matchesFilter = filter === "All" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <p className="wrapmate-eyebrow">Packaging management</p>
          <h1>Order Queue</h1>
          <p className="wrapmate-muted">
            Manage and monitor your bubble wrap packaging orders.
          </p>
        </div>

        <button
          className="wrapmate-primary-button wm-icon-button"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={16} />
          Add order
        </button>
      </div>

      <div className="order-stats">
        <div className="order-stat">
          <span>All orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="order-stat">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="order-stat">
          <span>Processing</span>
          <strong>{processingCount}</strong>
        </div>
        <div className="order-stat">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      <div className="orders-card">
        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Search order, SKU, or item..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="order-filters">
            {(["All", "Pending", "Processing", "Completed"] as const).map(
              (status) => (
                <button
                  key={status}
                  className={
                    filter === status ? "filter-button active" : "filter-button"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>
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
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
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
                    <td>
                      <select
                        className={`status-select ${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(
                            order.id,
                            event.target.value as OrderStatus
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="empty-orders">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddOrderDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
