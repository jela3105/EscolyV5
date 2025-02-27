import jwt from "jsonwebtoken";

export class JwtAdapter {
  static async generateToken(
    payload: Object,
    duration: number = 7200 // duration in seconds
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, "SEED", { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token!);
      });
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, "SEED", (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
