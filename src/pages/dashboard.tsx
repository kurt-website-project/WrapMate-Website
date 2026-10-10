import { Package, Clock3, LoaderCircle, CheckCircle2, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  // Sample dashboard data for now.
  // These can later be connected to your backend/database.
  const stats = {
    totalOrders: 24,
    pending: 8,
    processing: 5,
    completed: 11,
  };

  const recentActivity = [
    {
      id: "WM-003",
      message: "Order completed",
      customer: "Sample Store",
      time: "10 minutes ago",
      type: "completed",
    },
    {
      id: "WM-002",
      message: "Order is processing",
      customer: "LMJT Shop",
      time: "25 minutes ago",
      type: "processing",
    },
    {
      id: "WM-004",
      message: "New order added",
      customer: "New Customer",
      time: "1 hour ago",
      type: "new",
    },
  ];

  return (
    <div className="wrapmate-dashboard">
      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">WrapMate Dashboard</p>
          <h1>Welcome back!</h1>
          <p>
            Here's an overview of your packaging operations today.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Package />
          </div>
          <div>
            <span>Total Orders</span>
            <strong>{stats.totalOrders}</strong>
            <small>All recorded orders</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Clock3 />
          </div>
          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
            <small>Needs attention</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <LoaderCircle />
          </div>
          <div>
            <span>Processing</span>
            <strong>{stats.processing}</strong>
            <small>Currently in progress</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <CheckCircle2 />
          </div>
          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
            <small>Successfully processed</small>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Access commonly used WrapMate features.</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-action-card primary"
            onClick={() => navigate("/orders")}
          >
            <div className="dashboard-action-icon">
              <Plus />
            </div>

            <div>
              <strong>Manage Orders</strong>
              <span>View and process packaging orders</span>
            </div>

            <ArrowRight className="dashboard-action-arrow" />
          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() => navigate("/orders")}
          >
            <div className="dashboard-action-icon">
              <Package />
            </div>

            <div>
              <strong>Order Queue</strong>
              <span>Check pending and active orders</span>
            </div>

            <ArrowRight className="dashboard-action-arrow" />
          </button>
        </div>
      </section>

      {/* Packaging Overview */}
      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Packaging Overview</h2>
              <p>Today's packaging activity.</p>
            </div>
          </div>

          <div className="packaging-overview">
            <div className="overview-row">
              <span>Orders Today</span>
              <strong>12</strong>
            </div>

            <div className="overview-row">
              <span>Bubble Wrap Used</span>
              <strong>245 cm</strong>
            </div>

            <div className="overview-row">
              <span>Orders Completed</span>
              <strong>8</strong>
            </div>

            <div className="overview-row">
              <span>Average Wrap Length</span>
              <strong>20.4 cm</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Today's Status</h2>
              <p>Current order distribution.</p>
            </div>
          </div>

          <div className="status-overview">
            <div className="status-row">
              <div>
                <span>Completed</span>
                <strong>67%</strong>
              </div>
              <div className="status-bar">
                <div
                  className="status-bar-fill completed"
                  style={{ width: "67%" }}
                />
              </div>
            </div>

            <div className="status-row">
              <div>
                <span>Processing</span>
                <strong>21%</strong>
              </div>
              <div className="status-bar">
                <div
                  className="status-bar-fill processing"
                  style={{ width: "21%" }}
                />
              </div>
            </div>

            <div className="status-row">
              <div>
                <span>Pending</span>
                <strong>12%</strong>
              </div>
              <div className="status-bar">
                <div
                  className="status-bar-fill pending"
                  style={{ width: "12%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading dashboard-activity-heading">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest updates from your packaging operations.</p>
          </div>

          <button
            type="button"
            className="dashboard-view-button"
            onClick={() => navigate("/orders")}
          >
            View all orders
            <ArrowRight />
          </button>
        </div>

        <div className="dashboard-activity-list">
          {recentActivity.map((activity) => (
            <div className="dashboard-activity-item" key={activity.id}>
              <div className={`activity-icon ${activity.type}`}>
                {activity.type === "completed" && <CheckCircle2 />}
                {activity.type === "processing" && <LoaderCircle />}
                {activity.type === "new" && <Plus />}
              </div>

              <div className="activity-content">
                <strong>{activity.id}</strong>
                <span>
                  {activity.message} · {activity.customer}
                </span>
              </div>

              <time>{activity.time}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}