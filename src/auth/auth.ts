export type UserRole = "operator" | "admin";

export type WrapMateUser = {
  username: string;
  role: UserRole;
};

const USERS: Record<string, { password: string; role: UserRole }> = {
  operator: { password: "operator123", role: "operator" },
  admin: { password: "admin123", role: "admin" },
};

const STORAGE_KEY = "wrapmate_current_user";

export function login(username: string, password: string): WrapMateUser | null {
  const account = USERS[username];

  if (!account || account.password !== password) {
    return null;
  }

  const user: WrapMateUser = {
    username,
    role: account.role,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function currentUser(): WrapMateUser | null {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as WrapMateUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}
