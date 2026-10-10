import { useMemo, useState } from "react";

type OrderStatus = "Pending" | "Processing" | "Completed";

type Order = {
  id: string;
  customer: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  date: string;
};

const initialOrders: Order[] = [
  {
    id: "WM-001",
    customer: "Sample Customer 1",
    item: "Mug",
    quantity: 10,
    status: "Pending",
    date: "2026-10-07",
  },
  {
    id: "WM-002",
    customer: "Sample Customer 2",
    item: "Plate",
    quantity: 25,
    status: "Processing",
    date: "2026-10-07",
  },
  {
    id: "WM-003",
    customer: "Sample Customer 3",
    item: "Vase",
    quantity: 15,
    status: "Completed",
    date: "2026-10-06",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.item.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  }

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Order Queue</h1>
          <p>
            Manage and monitor your bubble wrap packaging orders.
          </p>
        </div>

        <button className="add-order-button">
          + Add Order
        </button>
      </div>

      <div className="order-stats">
        <div className="order-stat">
          <span>All Orders</span>
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
            placeholder="Search order, customer, or item..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="order-filters">
            {["All", "Pending", "Processing", "Completed"].map(
              (status) => (
                <button
                  key={status}
                  className={
                    filter === status
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setFilter(
                      status as "All" | OrderStatus
                    )
                  }
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
                <th>Customer</th>
                <th>Item</th>
                <th>Quantity</th>
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

                    <td>{order.customer}</td>

                    <td>{order.item}</td>

                    <td>{order.quantity}</td>

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
                        <option value="Pending">
                          Pending
                        </option>
                        <option value="Processing">
                          Processing
                        </option>
                        <option value="Completed">
                          Completed
                        </option>
                      </select>
                    </td>

                    <td>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-orders"
                  >
                    No orders found.
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