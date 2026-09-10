/**
 * Secure Vault Cryptographic and Session Utilities
 * Uses Web Crypto API for secure SHA-256 salted PIN hashing client-side.
 */

export const DEFAULT_VAULT_PIN = "feb11"; // Default secret passcode (feb11)
export const VAULT_AUTO_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const VAULT_CUSTOM_PIN_KEY = "olu_vault_custom_pin";
const VAULT_SESSION_KEY = "olu_vault_session";

export interface StoredVaultPin {
  salt: string;
  hash: string;
}

/**
 * Generates a random cryptographic hex salt
 */
export function generateSalt(length = 16): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
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
  const data = encoder.encode(pin.trim().toLowerCase() + ":" + salt);

  const cryptoObj = typeof window !== "undefined" ? window.crypto : (await import("crypto")).webcrypto;
  const hashBuffer = await cryptoObj.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Saves a new custom PIN to localStorage
 */
export async function saveCustomVaultPin(newPin: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const salt = generateSalt();
    const hash = await hashVaultPin(newPin, salt);
    const pinData: StoredVaultPin = { salt, hash };
    localStorage.setItem(VAULT_CUSTOM_PIN_KEY, JSON.stringify(pinData));
    return true;
  } catch (err) {
    console.error("Error saving custom vault PIN:", err);
    return false;
  }
}

/**
 * Verifies a candidate PIN against custom stored PIN or default PINs
 */
export async function verifyVaultPin(candidatePin: string): Promise<boolean> {
  if (!candidatePin) return false;
  const normalized = candidatePin.trim().toLowerCase();

  // Check custom PIN from localStorage first
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(VAULT_CUSTOM_PIN_KEY);
      if (stored) {
        const pinData: StoredVaultPin = JSON.parse(stored);
        if (pinData.salt && pinData.hash) {
          const computed = await hashVaultPin(candidatePin, pinData.salt);
          if (computed === pinData.hash) return true;
        }
      }
    } catch (e) {
      console.warn("Could not read custom vault PIN:", e);
    }
  }

  // Fallback default valid passcodes
  const validDefaults = [
    DEFAULT_VAULT_PIN.toLowerCase(), // "feb11"
    "0414",
    "1234",
    "universe",
    "love",
  ];

  return validDefaults.includes(normalized);
}

/**
 * Vault Session State Manager in sessionStorage with expiration timestamp
 */
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
