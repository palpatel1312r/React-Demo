
const bcrypt = require("bcryptjs");
const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

class User {
  static async create(userData) {
    const { name, email, password } = userData;

    try {
      console.log("📝 Creating user in DB:", { name, email });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert using Knex
      const [id] = await db("users").insert({
        name: name,
        email: email,
        password: hashedPassword,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      console.log("✅ User inserted, ID:", id);

      return {
        id: id,
        name,
        email,
      };
    } catch (error) {
      console.error("❌ Error in User.create:", error);
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      console.log("🔍 Finding user by email:", email);
      const user = await db("users").where({ email: email }).first();

      console.log("✅ User found:", user ? "Yes" : "No");
      return user || null;
    } catch (error) {
      console.error("❌ Error in findByEmail:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log("🔍 Finding user by ID:", id);
      const user = await db("users")
        .select("id", "name", "email", "created_at")
        .where({ id: id })
        .first();

      return user || null;
    } catch (error) {
      console.error("❌ Error in findById:", error);
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {
      console.log("🔐 Comparing passwords...");
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      console.log("✅ Password match:", isMatch);
      return isMatch;
    } catch (error) {
      console.error("❌ Error in comparePassword:", error);
      throw error;
    }
  }

  // Additional helpful methods
  static async getAllUsers() {
    try {
      return await db("users")
        .select("id", "name", "email", "created_at")
        .orderBy("created_at", "desc");
    } catch (error) {
      console.error("❌ Error in getAllUsers:", error);
      throw error;
    }
  }

  static async updateUser(id, data) {
    try {
      await db("users")
        .where({ id: id })
        .update({
          ...data,
          updated_at: db.fn.now(),
        });

      return await this.findById(id);
    } catch (error) {
      console.error("❌ Error in updateUser:", error);
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      await db("users").where({ id: id }).delete();
      return true;
    } catch (error) {
      console.error("❌ Error in deleteUser:", error);
      throw error;
    }
  }
}

module.exports = User;
