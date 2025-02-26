import { useEffect } from "react";
import FallbackCard from "../ui/cards/FallbackCard";

const CallbackComp = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token") || urlParams.get("code"); // Handle both token and code-based OAuth flows
    const error = urlParams.get("error");

    if (token) {
      // Send success message to the parent window
      window.opener?.postMessage({ status: "success", token }, window.origin);
    } else if (error) {
      // Send error message to the parent window
      window.opener?.postMessage(
        { status: "error", message: error },
        window.origin
      );
    }

    // Close the popup window
    window.close();
  }, []);

  return (
    <div>
      <FallbackCard message="Processing authentication..." />
    </div>
  );
};

export default CallbackComp;
