"use client";

import { useRef } from "react";
import { UserState, useUserStore } from "@/store/use-user-store";

export function UserStoreInitializer({ user }: { user: UserState | null }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useUserStore.setState({ user });
    initialized.current = true;
  }

  return null;
}
