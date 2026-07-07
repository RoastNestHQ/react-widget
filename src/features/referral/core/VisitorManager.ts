export class VisitorManager {
  private readonly KEY = "rrn_visitor_id";

  getOrCreate(): string {
    if (typeof window === "undefined") return "server_visitor";
    try {
      let id = localStorage.getItem(this.KEY);
      if (!id) {
        id = `vis_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(this.KEY, id);
      }
      return id;
    } catch (e) {
      return "fallback_visitor";
    }
  }
}
