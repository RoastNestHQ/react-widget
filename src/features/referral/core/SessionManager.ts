export class SessionManager {
  private readonly KEY = "rrn_session_id";

  getOrCreate(): string {
    if (typeof window === "undefined") return "server_session";
    try {
      let id = sessionStorage.getItem(this.KEY);
      if (!id) {
        id = `ses_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem(this.KEY, id);
      }
      return id;
    } catch (e) {
      return "fallback_session";
    }
  }
}
