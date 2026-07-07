export class ReferralDetector {
  private queryParam: string;

  constructor(queryParam: string = "ref") {
    this.queryParam = queryParam;
  }

  /**
   * Detects a referral code from the URL query parameters.
   */
  detect(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get(this.queryParam);
      if (!code) {
        code = urlParams.get("ref") || urlParams.get("referral") || urlParams.get("invite");
      }
      return code;
    } catch (e) {
      return null;
    }
  }
}
