import NetInfo from "@react-native-community/netinfo";

export const getNetworkState =
  async () => {
    const state =
      await NetInfo.fetch();

    return Boolean(
      state.isConnected &&
      state.isInternetReachable
    );
  };

export const subscribeToNetwork =
  (
    callback: (
      online: boolean
    ) => void
  ) => {
    return NetInfo.addEventListener(
      (state) => {
        callback(
          Boolean(
            state.isConnected &&
            state.isInternetReachable
          )
        );
      }
    );
  };