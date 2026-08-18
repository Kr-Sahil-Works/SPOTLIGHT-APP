import { useSignInWithGoogle } from "@clerk/expo/google";
import { useCallback } from "react";

export default function useGoogleLogin() {
  const { startGoogleAuthenticationFlow } =
    useSignInWithGoogle();

  const signInWithGoogle = useCallback(async () => {
    console.log("========== GOOGLE START ==========");

    try {
      const result =
        await startGoogleAuthenticationFlow();
      if (
        result.createdSessionId &&
        result.setActive
      ) {
        await result.setActive({
          session: result.createdSessionId,
        });
        return {
          success: true,
          cancelled: false,
        };
      }

      return {
        success: false,
        cancelled: false,
        error: "NO_SESSION_CREATED",
      };
    } catch (error: any) {

      console.log(
        "error:",
        error
      );

      console.log(
        "error code:",
        error?.code
      );

      console.log(
        "error message:",
        error?.message
      );

      console.log(
        "error name:",
        error?.name
      );

      console.log(
        "error JSON:",
        JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2
        )
      );
      return {
        success: false,
        cancelled:
          error?.code ===
          "SIGN_IN_CANCELLED",
        error,
      };
    }
  }, [startGoogleAuthenticationFlow]);

  return {
    signInWithGoogle,
  };
}