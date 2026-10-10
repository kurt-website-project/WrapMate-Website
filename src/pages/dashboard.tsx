import { Package, Clock3, CheckCircle2, ArrowRight } from "lucide-react";
import { useCan } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import { calculateWrapLength } from "@/lib/orders";
import { useOrders } from "@/providers/orders-store";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  const { data: canCreate } = useCan({
    resource: "orders",
    action: "create",
  });

  const pending = useMemo(
    () => orders.filter((order) => order.status === "Pending"),
    [orders]
  );
  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  return (
    <div className="wrapmate-dashboard">
      <div className="wrapmate-dashboard-heading">
        <div>
          <p className="wrapmate-eyebrow">Packaging management</p>
          <h1>Order Queue</h1>
          <p className="wrapmate-muted">
            Manage incoming packaging orders and prepare them for processing.
          </p>
        </div>

        {canCreate?.can && (
          <button
            className="wrapmate-primary-button wm-icon-button"
            onClick={() => navigate("/orders")}
          >
            Add order
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="wrapmate-stat-grid">
        <div className="wrapmate-stat-card">
          <div className="wrapmate-stat-icon">
            <Package size={20} />
          </div>
          <div>
            <span>Pending orders</span>
            <strong>{pending.length}</strong>
          </div>
        </div>

        <div className="wrapmate-stat-card">
          <div className="wrapmate-stat-icon">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Processing</span>
            <strong>{processingCount}</strong>
          </div>
        </div>

        <div className="wrapmate-stat-card">
          <div className="wrapmate-stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>
      </div>

      <section className="wrapmate-queue-card">
        <div className="wrapmate-section-heading">
          <div>
            <h2>Pending orders</h2>
            <p className="wrapmate-muted">
              Orders waiting to be processed.
            </p>
          </div>
          <span className="wrapmate-status-badge">
            {pending.length} pending
          </span>
        </div>

        {pending.length > 0 ? (
          <div className="wm-pending-list">
            {pending.map((order) => (
              <button
                key={order.id}
                className="wm-pending-row"
                onClick={() => navigate("/orders")}
              >
                <div className="wm-pending-main">
                  <strong>{order.id}</strong>
                  <span>{order.item}</span>
                </div>
                <div className="wm-pending-meta">
                  <span>
                    {order.width} x {order.height} cm · P
                    {order.protection.toFixed(1)}
                  </span>
                  <span className="wm-pending-length">
                    L ={" "}
                    {calculateWrapLength(
                      order.width,
                      order.height,
                      order.protection
                    )}{" "}
                    cm
                  </span>
                </div>
                <ArrowRight size={16} className="wm-pending-arrow" />
              </button>
            ))}
          </div>
        ) : (
          <div className="wrapmate-empty-state">
            <Package size={36} />
            <h3>No pending orders yet</h3>
            <p>The order queue is ready.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
