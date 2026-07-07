import { ReferralData } from "../components/ReferralWidget/types";

export class ReferralStorage {
  private durationDays: number;
  private readonly COOKIE_KEY = "rrn_referral";
  private readonly STORAGE_KEY = "rrn_referral";

  constructor(durationDays: number = 30) {
    this.durationDays = durationDays;
  }

  save(data: ReferralData): void {
    if (typeof window === "undefined") return;
    const value = JSON.stringify(data);
    this.saveCookie(value);
    this.saveLocalStorage(value);
  }

  read(): ReferralData | null {
    if (typeof window === "undefined") return null;
    const value = this.readCookie() || this.readLocalStorage();
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt)
      };
    } catch (e) {
      return null;
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    this.clearCookie();
    this.clearLocalStorage();
  }

  private saveCookie(value: string) {
    const expires = new Date(Date.now() + this.durationDays * 864e5).toUTCString();
    document.cookie = `${this.COOKIE_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  private readCookie(): string | null {
    const name = `${this.COOKIE_KEY}=`;
    const decoded = decodeURIComponent(document.cookie);
    const ca = decoded.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  private clearCookie() {
    document.cookie = `${this.COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  private saveLocalStorage(value: string) {
    try {
      localStorage.setItem(this.STORAGE_KEY, value);
    } catch (e) {}
  }

  private readLocalStorage(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  private clearLocalStorage() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
  }
}
