import { useState } from "react";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Orders from "./pages/orders";
import Records from "./pages/records";
import { currentUser, logout, type WrapMateUser } from "./auth/auth";
import { Home, Package, ClipboardList } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import { OrdersProvider } from "./providers/orders-store";


function AuthenticatedApp({ user, setUser }: {
  user: WrapMateUser;
  setUser: (user: WrapMateUser | null) => void;
}) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <RefineKbarProvider>
      <ThemeProvider>
        <DevtoolsProvider>
          <OrdersProvider>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "qLedav-z4lJY5-ly2aJh",
            }}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: { label: "Home", icon: <Home /> },
              },
              {
                name: "orders",
                list: "/orders",
                meta: { label: "Order Queue", icon: <Package /> },
              },
              {
                name: "records",
                list: "/records",
                meta: { label: "Records", icon: <ClipboardList /> },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Layout
                    user={{ username: user.username, role: user.role }}
                    onLogout={handleLogout}
                  >
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/records" element={<Records />} />
              </Route>
            </Routes>

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          </OrdersProvider>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </ThemeProvider>
    </RefineKbarProvider>
  );
}

function App() {
  const [user, setUser] = useState<WrapMateUser | null>(currentUser());

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route
            path="*"
            element={
              <Login
                onLogin={(loggedInUser) => {
                  setUser(loggedInUser);
                }}
              />
            }
          />
        </Routes>
      ) : (
        <AuthenticatedApp user={user} setUser={setUser} />
      )}
    </BrowserRouter>
  );
}

export default App;
