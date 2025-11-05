import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 64;

/**
 * Generate encryption key from password using PBKDF2
 */
export const generateKey = (password: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
};

/**
 * Encrypt message content
 */
export const encryptMessage = (
  text: string,
  password: string
): { encryptedData: string; iv: string; authTag: string; salt: string } => {
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive key from password
  const key = generateKey(password, salt);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    salt: salt.toString('hex'),
  };
};

/**
 * Decrypt message content
 */
export const decryptMessage = (
  encryptedData: string,
  password: string,
  iv: string,
  authTag: string,
  salt: string
): string => {
  // Convert hex strings back to buffers
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');
  const saltBuffer = Buffer.from(salt, 'hex');

  // Derive key from password
  const key = generateKey(password, saltBuffer);

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  // Decrypt
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

/**
 * Generate a secure random password for encryption
 */
export const generateEncryptionPassword = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash password for storage (one-way)
 */
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

