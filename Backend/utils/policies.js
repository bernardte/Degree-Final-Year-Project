// Role check helpers
const isAdmin = (req) => req.user.role === "admin";
const isManager = (req) => req.user.role === "manager";
const isUser = (req) => req.user.role === "user";
const isAdminOrManager = (req) => isAdmin(req) || isManager(req);

const policies = {
  profile: {
    update: isAdminOrManager,
    view: isAdminOrManager,
  },

  users: {
    delete: isManager,
    view: isAdminOrManager,
    update: isAdminOrManager,
  },

  booking: {
    view_all: isAdminOrManager,
    view: isAdminOrManager,
    update_booking_status: isAdminOrManager,
    cancel_any: isManager,
    view_own: isUser,
  },

  rooms: {
    view_all: isManager,
    create_room: isManager,
    delete_room: isManager,
    update_room: isManager,
  },

  payments: {
    view_all: isAdminOrManager,
    update_payment_status: isAdminOrManager,
    approve_refund: isManager,//todo: haven't create yet
  },

  reports: {
    view: isAdminOrManager,
    generate: isAdminOrManager,
  },

  assignRole: {
    update: isManager,
    delete: isManager,
    create: isManager,
  },

  amenities: {
    view_all: isManager,
    create: isManager,
    update: isManager,
    delete: isManager,
  },

  events: {
    view_all: isAdminOrManager,
  },

  rateAndReview: {
    create: isUser,
  },


};

export default policies;
