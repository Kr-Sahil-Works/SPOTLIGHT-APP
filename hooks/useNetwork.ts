import { useEffect, useState } from "react";

import {
    getNetworkState,
    subscribeToNetwork,
} from "@/lib/network";

export default function useNetwork() {
  const [isOnline, setIsOnline] =
    useState(true);

  useEffect(() => {
    getNetworkState().then(
      setIsOnline
    );

    const unsubscribe =
      subscribeToNetwork(
        setIsOnline
      );

    return unsubscribe;
  }, []);

  return isOnline;
}