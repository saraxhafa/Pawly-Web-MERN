const Contact = require("../models/contactModel");

const createContact = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Message saved successfully",
      data: contact,
    });

  } catch (error) {
    console.error("Contact error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createContact,
};