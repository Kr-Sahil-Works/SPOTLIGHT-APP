import LegalScreen from "@/components/common/LegalScreen";
import { PRIVACY_SECTIONS } from "@/constants/legal/privacy";

export default function PrivacyPolicy() {
  return (
    <LegalScreen
      title="Privacy Policy"
      updated="June 2026"
      sections={PRIVACY_SECTIONS}
    />
  );
}