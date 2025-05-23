// Role check helpers
const isSuperAdmin = (req) => req.user.role === "superAdmin";
const isAdmin = (req) => req.user.role === "admin";
const isUser = (req) => req.user.role === "user";
const isSuperAdminOrAdmin = (req) => isSuperAdmin(req) || isAdmin(req);
const isSuperAdminOrAdminOrUser = (req) => isSuperAdmin(req) || isAdmin(req) || isUser(req);
const policies = {
  profile: {
    update: isSuperAdminOrAdmin,
    view: isSuperAdminOrAdmin,
  },

  users: {
    delete: isSuperAdmin,
    view: isSuperAdminOrAdmin,
    update: isSuperAdminOrAdmin,
  },

  booking: {
    view_all: isSuperAdminOrAdmin,
    view: isSuperAdminOrAdmin,
    update_booking_status: isSuperAdminOrAdmin,
    cancel_any: isSuperAdmin,
    view_own: isSuperAdminOrAdminOrUser,
  },

  rooms: {
    view_all: isSuperAdminOrAdmin,
    create_room: isSuperAdmin,
    delete_room: isSuperAdmin,
    update_room: isSuperAdmin,
  },

  payments: {
    view_all: isSuperAdminOrAdmin,
    update_payment_status: isSuperAdminOrAdmin,
    approve_refund: isSuperAdmin, //todo: haven't created yet
  },

  reports: {
    view: isSuperAdminOrAdmin,
    generate: isSuperAdminOrAdmin,
  },

  assignRole: {
    update: isSuperAdmin,
    delete: isSuperAdmin,
    create: isSuperAdmin,
  },

  amenities: {
    view_all: isSuperAdminOrAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },

  events: {
    view_all: isSuperAdminOrAdmin,
    update_event_status: isSuperAdminOrAdmin,
    reject_event_status: isSuperAdmin,
  },

  rateAndReview: {
    create: isSuperAdminOrAdminOrUser,
  },

  OTP: {
    view: isSuperAdmin,
    update: isSuperAdmin,
    create: isSuperAdmin,
  },
};

export default policies;
