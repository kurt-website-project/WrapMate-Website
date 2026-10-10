export type OrderStatus = "Pending" | "Processing" | "Completed";

export type ProtectionLevel = 1 | 2 | 3;

export type Order = {
  id: string;
  sku: string;
  item: string;
  width: number; // W, in cm
  height: number; // H, in cm
  protection: ProtectionLevel; // P
  quantity: number;
  status: OrderStatus;
  date: string;
};

/** Fixed packaging allowance (A) in centimeters, per the capstone formula. */
export const PACKAGING_ALLOWANCE = 5;

/** Protection multiplier options defined by the capstone. */
export const PROTECTION_LEVELS: ProtectionLevel[] = [1, 2, 3];

/**
 * Required bubble-wrap length using the capstone's standardized formula:
 *   L = (2 x (W + H) x P) + A
 * where W = box width, H = box height, P = protection multiplier,
 * and A = 5 cm packaging allowance.
 */
export function calculateWrapLength(
  width: number,
  height: number,
  protection: ProtectionLevel
): number {
  const length = 2 * (width + height) * protection + PACKAGING_ALLOWANCE;
  return Math.round(length * 100) / 100;
}

export const initialOrders: Order[] = [
  {
    id: "WM-001",
    sku: "PH-CASE-01",
    item: "Phone Case Box",
    width: 8,
    height: 2,
    protection: 1,
    quantity: 10,
    status: "Pending",
    date: "2026-10-07",
  },
  {
    id: "WM-002",
    sku: "PWR-BNK-02",
    item: "Power Bank Box",
    width: 12,
    height: 5,
    protection: 2,
    quantity: 25,
    status: "Processing",
    date: "2026-10-07",
  },
  {
    id: "WM-003",
    sku: "EARBUD-03",
    item: "Earbuds Box",
    width: 6,
    height: 4,
    protection: 3,
    quantity: 15,
    status: "Completed",
    date: "2026-10-06",
  },
];

/** Generates the next order id in the WM-00N format. */
export function nextOrderId(orders: Order[]): string {
  const maxNumber = orders.reduce((max, order) => {
    const match = order.id.match(/WM-(\d+)/);
    const value = match ? parseInt(match[1], 10) : 0;
    return value > max ? value : max;
  }, 0);
  return `WM-${String(maxNumber + 1).padStart(3, "0")}`;
}
