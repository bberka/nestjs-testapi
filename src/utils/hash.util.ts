import * as crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });
}
export function generateRefreshToken() {
  return hashPassword(crypto.randomBytes(64).toString('hex'));
}
