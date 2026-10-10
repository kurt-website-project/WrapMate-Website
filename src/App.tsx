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
import { currentUser, logout, type WrapMateUser } from "./auth/auth";
import { Home, Package } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";


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
            ]}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <div className="wrapmate-user-bar">
                      <span>
                        Logged in as <strong>{user.username}</strong> ({user.role})
                      </span>
                      <button type="button" onClick={handleLogout}>
                        Log out
                      </button>
                    </div>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Routes>

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
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
