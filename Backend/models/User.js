const knex = require("knex");
const knexConfig = require("../knexfile");
const bcrypt = require("bcryptjs");

const db = knex(knexConfig.development);

class User {
  // Create a new user
  static async create({ name, email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [user] = await db("users")
        .insert({
          name,
          email,
          password: hashedPassword,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        })
        .returning(["id", "name", "email", "created_at"]);

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      return await db("users").select("*").where("email", email).first();
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      return await db("users")
        .select("id", "name", "email", "created_at")
        .where("id", id)
        .first();
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error comparing password:", error);
      throw error;
    }
  }
}

module.exports = User;
