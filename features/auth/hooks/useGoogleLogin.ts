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

      console.log(
        "========== GOOGLE RESULT =========="
      );

      console.log(
        "createdSessionId:",
        result.createdSessionId
      );

      console.log(
        "has setActive:",
        !!result.setActive
      );

      console.log(
        "signIn exists:",
        !!result.signIn
      );

      console.log(
        "signUp exists:",
        !!result.signUp
      );

      console.log(
        "signIn status:",
        result.signIn?.status
      );

      console.log(
        "signUp status:",
        result.signUp?.status
      );

      console.log(
        "signIn createdSessionId:",
        result.signIn?.createdSessionId
      );

      console.log(
        "signUp createdSessionId:",
        result.signUp?.createdSessionId
      );

      console.log(
        "signIn firstFactor:",
        result.signIn?.firstFactorVerification?.status
      );

      console.log(
        "signUp externalAccount:",
        result.signUp?.verifications?.externalAccount?.status
      );

      console.log(
        "========== GOOGLE END =========="
      );

      if (
        result.createdSessionId &&
        result.setActive
      ) {
        await result.setActive({
          session: result.createdSessionId,
        });

        console.log(
          "========== SESSION ACTIVE =========="
        );

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
        "========== GOOGLE ERROR =========="
      );

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

      console.log(
        "========== GOOGLE ERROR END =========="
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