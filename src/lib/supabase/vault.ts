/**
 * Secure Vault Cryptographic and Session Utilities
 * Uses the Web Crypto API for secure SHA-256 salted PIN hashing without external binary dependencies.
 */

export const DEFAULT_VAULT_PIN = "0414"; // Default romantic anniversary PIN
export const VAULT_AUTO_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generates a random cryptographic hex salt
 */
export function generateSalt(length = 16): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  // Server-side fallback using crypto if available
  const chars = "0123456789abcdef";
  let salt = "";
  for (let i = 0; i < length * 2; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)];
  }
  return salt;
}

/**
 * Computes a SHA-256 hash of (PIN + Salt) using the Web Crypto API
 */
export async function hashVaultPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + ":" + salt);

  const cryptoObj = typeof window !== "undefined" ? window.crypto : (await import("crypto")).webcrypto;
  const hashBuffer = await cryptoObj.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies a candidate PIN against a known salt and hash
 */
export async function verifyVaultPin(
  candidatePin: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  if (!candidatePin || !salt || !expectedHash) return false;
  const computed = await hashVaultPin(candidatePin, salt);
  return computed === expectedHash;
}

/**
 * Vault Session State Manager in localStorage with expiration timestamp
 */
const VAULT_SESSION_KEY = "olu_vault_session";

export interface VaultSession {
  unlockedAt: number;
  expiresAt: number;
}

export function saveVaultSession(durationMs = VAULT_AUTO_LOCK_TIMEOUT_MS): void {
  if (typeof window === "undefined") return;
  const session: VaultSession = {
    unlockedAt: Date.now(),
    expiresAt: Date.now() + durationMs,
  };
  try {
    sessionStorage.setItem(VAULT_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("Could not save vault session:", e);
  }
}

export function isVaultSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const item = sessionStorage.getItem(VAULT_SESSION_KEY);
    if (!item) return false;
    const session: VaultSession = JSON.parse(item);
    if (Date.now() > session.expiresAt) {
      clearVaultSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearVaultSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(VAULT_SESSION_KEY);
  } catch {}
}

export function touchVaultSession(durationMs = VAULT_AUTO_LOCK_TIMEOUT_MS): void {
  if (isVaultSessionActive()) {
    saveVaultSession(durationMs);
  }
}
