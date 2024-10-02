import crypto from 'crypto';

// Fungsi untuk mengenkripsi token
export function encryptToken(token: string): string {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || '';

    // Validasi panjang secret key (32 byte untuk AES-256)
    if (secretKey.length !== 32) {
        throw new Error('Invalid key length. Secret key must be 32 bytes.');
    }

    // Generate random IV (16 bytes for AES-CBC)
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

    // Encrypt token
    let encryptedToken = cipher.update(token, 'utf8', 'base64');
    encryptedToken += cipher.final('base64');

    // Return IV dan encrypted token dalam format base64
    const base64Iv = iv.toString('base64');
    return `${base64Iv}:${encryptedToken}`;
}

// Fungsi untuk mendekripsi token
export function decryptToken(encryptedToken: string): string {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || '';

    // Validasi panjang secret key (32 byte untuk AES-256)
    if (secretKey.length !== 32) {
        throw new Error('Invalid key length. Secret key must be 32 bytes.');
    }

    const [base64Iv, base64Encrypted] = encryptedToken.split(':');

    // Convert base64 ke buffer
    const iv = Buffer.from(base64Iv, 'base64');
    const encryptedText = Buffer.from(base64Encrypted, 'base64');

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

    // Decrypt token
    let decryptedToken = decipher.update(encryptedText, 'base64', 'utf8');
    decryptedToken += decipher.final('utf8');

    return decryptedToken; // Return decrypted token
}
