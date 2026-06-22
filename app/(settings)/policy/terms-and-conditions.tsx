import LegalScreen from "@/components/common/LegalScreen";
import { TERMS_SECTIONS } from "@/constants/legal/terms";

export default function TermsAndConditions() {
  return (
    <LegalScreen
      title="Terms of Use"
      updated="June 2026"
      sections={TERMS_SECTIONS}
    />
  );
}