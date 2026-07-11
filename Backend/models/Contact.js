const knex = require("knex");
const knexConfig = require("../knexfile");

// Create a single instance of Knex
const db = knex(knexConfig.development);

class Contact {
  // Save contact message
  static async create({ name, email, message }) {
    try {
      console.log("📝 Creating contact in database...");
      console.log("📊 Data:", { name, email, message });

      // Insert the data
      const result = await db("contacts").insert({
        name: name,
        email: email,
        message: message,
        is_read: false,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      console.log("✅ Insert result:", result);

      // Get the inserted contact
      const contact = await db("contacts")
        .select("*")
        .where("id", result[0])
        .first();

      console.log("✅ Contact created:", contact);
      return contact;
    } catch (error) {
      console.error("❌ Error in Contact.create:", error);
      console.error("❌ Error details:", {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
      throw error;
    }
  }

  // Get all contact messages
  static async findAll() {
    try {
      return await db("contacts").select("*").orderBy("created_at", "desc");
    } catch (error) {
      console.error("❌ Error in Contact.findAll:", error);
      throw error;
    }
  }

  // Get unread messages
  static async findUnread() {
    try {
      return await db("contacts")
        .select("*")
        .where("is_read", false)
        .orderBy("created_at", "desc");
    } catch (error) {
      console.error("❌ Error in Contact.findUnread:", error);
      throw error;
    }
  }

  // Get single contact by ID
  static async findById(id) {
    try {
      return await db("contacts").select("*").where("id", id).first();
    } catch (error) {
      console.error("❌ Error in Contact.findById:", error);
      throw error;
    }
  }

  // Mark message as read
  static async markAsRead(id) {
    try {
      await db("contacts").where("id", id).update({
        is_read: true,
        updated_at: db.fn.now(),
      });

      return await db("contacts").select("*").where("id", id).first();
    } catch (error) {
      console.error("❌ Error in Contact.markAsRead:", error);
      throw error;
    }
  }

  // Delete contact message
  static async delete(id) {
    try {
      return await db("contacts").where("id", id).del();
    } catch (error) {
      console.error("❌ Error in Contact.delete:", error);
      throw error;
    }
  }
}

module.exports = Contact;
