import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  initialOrders,
  nextOrderId,
  type Order,
  type OrderStatus,
  type ProtectionLevel,
} from "@/lib/orders";

export type NewOrderInput = {
  sku: string;
  item: string;
  width: number;
  height: number;
  protection: ProtectionLevel;
  quantity: number;
};

type OrdersContextValue = {
  orders: Order[];
  addOrder: (input: NewOrderInput) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: PropsWithChildren) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = useCallback((input: NewOrderInput) => {
    setOrders((current) => {
      const order: Order = {
        id: nextOrderId(current),
        sku: input.sku,
        item: input.item,
        width: input.width,
        height: input.height,
        protection: input.protection,
        quantity: input.quantity,
        status: "Pending",
        date: new Date().toISOString().slice(0, 10),
      };
      return [order, ...current];
    });
  }, []);

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }, []);

  const value = useMemo(
    () => ({ orders, addOrder, updateStatus }),
    [orders, addOrder, updateStatus]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
