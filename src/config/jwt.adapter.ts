import jwt from "jsonwebtoken";
import { resolve } from "path";

export class JwtAdapter {
  static async generateToken(
    payload: Object,
    duration: number = 2000 
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, "SEED", { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token!);
      });
    });
  }

  static validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, "SEED", (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    });
  }
}
