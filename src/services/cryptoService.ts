
import { ErrorService } from './errorService';

// Service de chiffrement avancé côté client
export class CryptoService {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  // Générer une clé de chiffrement
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey({
      name: this.ALGORITHM,
      length: this.KEY_LENGTH,
    }, true, ['encrypt', 'decrypt']);
  }

  // Dériver une clé à partir d'un mot de passe
  static async deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const passwordBuffer = new TextEncoder().encode(password);
    
    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey({
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    }, baseKey, {
      name: this.ALGORITHM,
      length: this.KEY_LENGTH
    }, true, ['encrypt', 'decrypt']);
  }

  // Chiffrer des données
  static async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    try {
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      const encodedData = new TextEncoder().encode(data);
      
      const encrypted = await crypto.subtle.encrypt({
        name: this.ALGORITHM,
        iv: iv
      }, key, encodedData);

      return { encrypted, iv };
    } catch (error) {
      ErrorService.logError(error as Error, { context: 'Encryption failed' });
      throw new Error('Échec du chiffrement');
    }
  }

  // Déchiffrer des données
  static async decrypt(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
    try {
      const decrypted = await crypto.subtle.decrypt({
        name: this.ALGORITHM,
        iv: iv as unknown as BufferSource
      }, key, encryptedData);

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      ErrorService.logError(error as Error, { context: 'Decryption failed' });
      throw new Error('Échec du déchiffrement');
    }
  }

  // Générer un sel cryptographique
  static generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  }

  // Hacher un mot de passe avec salt
  static async hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: Uint8Array }> {
    const actualSalt = salt || this.generateSalt();
    const passwordBuffer = new TextEncoder().encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: actualSalt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    }, key, 256);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return { hash, salt: actualSalt };
  }

  // Convertir ArrayBuffer en base64
  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Convertir base64 en ArrayBuffer
  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
