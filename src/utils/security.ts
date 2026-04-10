
import { rateLimiter } from '@/services/validationService';
import { SecurityMonitoringService } from '@/services/securityMonitoringService';
import { IntrusionDetectionService } from '@/services/intrusionDetectionService';
import { CryptoService } from '@/services/cryptoService';

// Génération d'un token CSRF renforcé
export const generateCSRFToken = (): string => {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const randomString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${timestamp}-${randomString}`;
};

// Validation des permissions avec logging de sécurité
export const hasPermission = (userRole: string | null, requiredRole: 'admin' | 'user'): boolean => {
  const hasAccess = userRole ? (requiredRole === 'admin' ? userRole === 'admin' : ['admin', 'user'].includes(userRole)) : false;
  
  if (!hasAccess) {
    SecurityMonitoringService.logSecurityEvent(
      'authorization',
      'medium',
      `Tentative d'accès non autorisé - Rôle requis: ${requiredRole}, Rôle utilisateur: ${userRole || 'aucun'}`,
      { requiredRole, userRole, timestamp: new Date().toISOString() }
    );
  }
  
  return hasAccess;
};

// Wrapper sécurisé pour les opérations CRUD admin avec monitoring avancé
export const secureAdminOperation = async <T>(
  operation: () => Promise<T>,
  userRole: string | null,
  operationType: string = 'admin_operation'
): Promise<{ success: boolean; data?: T; error?: string }> => {
  const sessionId = sessionStorage.getItem('session-id') || crypto.randomUUID();
  
  try {
    // Vérifier si la session est bloquée
    if (IntrusionDetectionService.isSessionBlocked(sessionId)) {
      SecurityMonitoringService.logSecurityEvent(
        'security_violation',
        'critical',
        `Tentative d'opération depuis une session bloquée: ${operationType}`,
        { sessionId, operationType }
      );
      return { success: false, error: 'Session bloquée pour activité suspecte' };
    }

    // Vérifier les permissions
    if (!hasPermission(userRole, 'admin')) {
      IntrusionDetectionService.analyzeBehavior(
        sessionId,
        'unauthorized_admin_access',
        undefined,
        { operationType, userRole }
      );
      return { success: false, error: 'Permissions insuffisantes' };
    }

    // Rate limiting renforcé
    const rateLimitKey = `${operationType}_${sessionId}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 10, 60000)) {
      SecurityMonitoringService.logSecurityEvent(
        'suspicious_activity',
        'high',
        `Rate limit dépassé pour l'opération: ${operationType}`,
        { sessionId, operationType }
      );
      return { success: false, error: 'Trop de tentatives. Veuillez patienter.' };
    }

    // Analyser le comportement
    IntrusionDetectionService.analyzeBehavior(
      sessionId,
      operationType,
      undefined,
      { success: true }
    );

    // Exécuter l'opération
    const result = await operation();
    
    // Log de succès
    SecurityMonitoringService.logSecurityEvent(
      'data_access',
      'low',
      `Opération admin réussie: ${operationType}`,
      { sessionId, operationType, success: true }
    );
    
    return { success: true, data: result };
  } catch (error) {
    SecurityMonitoringService.logSecurityEvent(
      'security_violation',
      'high',
      `Échec de l'opération sécurisée: ${operationType}`,
      { 
        sessionId, 
        operationType, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    );
    
    console.error(`Secure operation failed:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// Headers de sécurité renforcés
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
};

// Fonction renforcée pour vérifier la force du mot de passe
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
  isVeryStrong: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;

  // Tests de base
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères (12+ recommandé)');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres minuscules');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres majuscules');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des chiffres');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des caractères spéciaux (!@#$%^&*)');
  }

  // Tests avancés
  if (password.length >= 16) {
    score += 1;
  }

  if (/[!@#$%^&*(),.?":{}|<>]{2,}/.test(password)) {
    score += 1;
  }

  // Vérifications de sécurité avancées
  const commonPasswords = [
    'password', '123456', 'azerty', 'admin', 'letmein', 'welcome',
    'password123', 'admin123', 'qwerty', '12345678', 'football'
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score = Math.max(0, score - 3);
    feedback.push('Évitez les mots de passe courants');
  }

  // Vérifier les patterns répétitifs
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Évitez les caractères répétitifs');
  }

  // Vérifier les séquences
  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Évitez les séquences évidentes');
  }

  return {
    score,
    feedback,
    isStrong: score >= 5,
    isVeryStrong: score >= 7,
  };
};

// Chiffrement avancé pour les données sensibles
export const encryptSensitiveData = async (data: string, password?: string): Promise<string> => {
  try {
    if (password) {
      const salt = CryptoService.generateSalt();
      const key = await CryptoService.deriveKeyFromPassword(password, salt);
      const { encrypted, iv } = await CryptoService.encrypt(data, key);
      
      return JSON.stringify({
        encrypted: CryptoService.arrayBufferToBase64(encrypted),
        iv: Array.from(iv),
        salt: Array.from(salt),
        method: 'password'
      });
    } else {
      const key = await CryptoService.generateKey();
      const { encrypted, iv } = await CryptoService.encrypt(data, key);
      
      return JSON.stringify({
        encrypted: CryptoService.arrayBufferToBase64(encrypted),
        iv: Array.from(iv),
        method: 'generated'
      });
    }
  } catch (error) {
    SecurityMonitoringService.logSecurityEvent(
      'security_violation',
      'high',
      'Échec du chiffrement des données sensibles',
      { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    );
    throw error;
  }
};

// Déchiffrement des données sensibles
export const decryptSensitiveData = async (encryptedData: string, password?: string): Promise<string> => {
  try {
    const data = JSON.parse(encryptedData);
    const encrypted = CryptoService.base64ToArrayBuffer(data.encrypted);
    const iv = new Uint8Array(data.iv);
    
    if (data.method === 'password' && password) {
      const salt = new Uint8Array(data.salt);
      const key = await CryptoService.deriveKeyFromPassword(password, salt);
      return await CryptoService.decrypt(encrypted, key, iv);
    }
    
    throw new Error('Méthode de déchiffrement non supportée');
  } catch (error) {
    SecurityMonitoringService.logSecurityEvent(
      'security_violation',
      'medium',
      'Échec du déchiffrement des données',
      { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    );
    throw error;
  }
};

// Obfuscation avancée du texte
export const obfuscateText = (text: string, visibleChars: number = 4, pattern: string = '*'): string => {
  if (text.length <= visibleChars) {
    return pattern.repeat(text.length);
  }
  
  const visible = text.slice(-visibleChars);
  const hidden = pattern.repeat(text.length - visibleChars);
  return hidden + visible;
};

// Nettoyage renforcé des données sensibles
export const sanitizeForStorage = (data: Record<string, any>): Record<string, any> => {
  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'auth', 'session',
    'csrf', 'api_key', 'private', 'credential', 'pin', 'code'
  ];
  
  const cleaned = { ...data };
  
  const sanitizeValue = (obj: any, path: string = ''): any => {
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item, index) => sanitizeValue(item, `${path}[${index}]`));
      } else {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            result[key] = '[REDACTED]';
            SecurityMonitoringService.logSecurityEvent(
              'data_access',
              'low',
              `Données sensibles nettoyées: ${currentPath}`,
              { path: currentPath, action: 'sanitization' }
            );
          } else {
            result[key] = sanitizeValue(value, currentPath);
          }
        }
        return result;
      }
    }
    return obj;
  };
  
  return sanitizeValue(cleaned);
};

// Validation de l'intégrité des données
export const validateDataIntegrity = async (data: string): Promise<boolean> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Stocker le hash pour vérification future
    sessionStorage.setItem(`integrity_${hash.substring(0, 8)}`, hash);
    
    return true;
  } catch (error) {
    SecurityMonitoringService.logSecurityEvent(
      'security_violation',
      'medium',
      'Échec de la validation d\'intégrité des données',
      { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    );
    return false;
  }
};

// Middleware de sécurité pour les requêtes
export const secureRequestMiddleware = (request: any): any => {
  const sessionId = sessionStorage.getItem('session-id') || crypto.randomUUID();
  
  // Vérifier si la session est bloquée
  if (IntrusionDetectionService.isSessionBlocked(sessionId)) {
    throw new Error('Session bloquée pour activité suspecte');
  }
  
  // Ajouter les headers de sécurité
  const secureRequest = {
    ...request,
    headers: {
      ...request.headers,
      ...securityHeaders,
      'X-Session-ID': sessionId,
      'X-CSRF-Token': generateCSRFToken()
    }
  };
  
  // Analyser le comportement
  IntrusionDetectionService.analyzeBehavior(
    sessionId,
    'api_request',
    undefined,
    { url: request.url, method: request.method }
  );
  
  return secureRequest;
};
