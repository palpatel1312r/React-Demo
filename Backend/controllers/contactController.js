const Contact = require("../models/Contact");

// Submit contact form
const submitContact = async (req, res) => {
  console.log("📝 Contact form submission received");
  console.log("Request body:", req.body);

  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email format");
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Save to database
    console.log("💾 Saving contact message to database...");
    const contact = await Contact.create({ name, email, message });
    console.log("✅ Contact message saved:", contact);

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Contact submission error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while saving your message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all contact messages (Admin only)
const getAllContacts = async (req, res) => {
  try {
    console.log("📋 Fetching all contact messages");
    const contacts = await Contact.findAll();
    console.log(`✅ Found ${contacts.length} messages`);
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get unread contact messages (Admin only)
const getUnreadContacts = async (req, res) => {
  try {
    console.log("📋 Fetching unread contact messages");
    const contacts = await Contact.findUnread();
    console.log(`✅ Found ${contacts.length} unread messages`);
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching unread contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Mark contact message as read (Admin only)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📖 Marking contact ${id} as read`);

    const contact = await Contact.markAsRead(id);
    if (!contact) {
      console.log(`❌ Contact ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    console.log(`✅ Contact ${id} marked as read`);
    res.json({
      success: true,
      message: "Message marked as read",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Error marking contact as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete contact message (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting contact ${id}`);

    const deleted = await Contact.delete(id);
    if (!deleted) {
      console.log(`❌ Contact ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    console.log(`✅ Contact ${id} deleted`);
    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getUnreadContacts,
  markAsRead,
  deleteContact,
};
