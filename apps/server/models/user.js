import { connection } from "../database/connection.js";

export class UserModel {
  static async getByEmail({ email }) {
    const result = await connection.query("SELECT * FROM users WHERE email = ?", [email])
    return result[0][0]
  }

  // static async getByEmailAndPassword({ email, password }) {
  //   const result = await connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])
  //   return result[0]
  // }

  static async create({ name, email, password }) {
    const result = await connection.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password])
    return result
  }
}
