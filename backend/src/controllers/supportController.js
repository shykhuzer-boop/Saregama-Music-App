const supportService = require('../services/supportService');
const ApiResponse = require('../utils/apiResponse');

class SupportController {
  async listFAQs(req, res, next) {
    try {
      const { search, category } = req.query;
      const faqs = await supportService.listFAQs({ search, category });
      return ApiResponse.success(res, { faqs });
    } catch (error) {
      next(error);
    }
  }

  async createTicket(req, res, next) {
    try {
      const { subject, category, message, priority } = req.body;
      const ticket = await supportService.createTicket(
        req.userId,
        req.user.name,
        req.user.email,
        { subject, category, message, priority }
      );
      return ApiResponse.created(res, { ticket }, 'Support ticket submitted');
    } catch (error) {
      next(error);
    }
  }

  async getUserTickets(req, res, next) {
    try {
      const tickets = await supportService.getUserTickets(req.userId);
      return ApiResponse.success(res, { tickets });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportController();
