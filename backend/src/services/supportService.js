const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');

class SupportService {
  /**
   * List FAQs with optional search and category filter
   */
  async listFAQs({ search = '', category = '' }) {
    const query = {};

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ createdAt: 1 });
    return faqs;
  }

  /**
   * Create a support ticket
   */
  async createTicket(userId, userName, userEmail, { subject, category, message, priority }) {
    const ticket = await SupportTicket.create({
      userId,
      userName,
      userEmail,
      subject,
      category,
      message,
      priority: priority || 'medium',
      status: 'open',
    });

    return ticket;
  }

  /**
   * List user's support tickets
   */
  async getUserTickets(userId) {
    const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
    return tickets;
  }
}

module.exports = new SupportService();
