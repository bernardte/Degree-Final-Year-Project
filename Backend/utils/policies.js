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
    decline_request: isSuperAdminOrAdmin,
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
    approve_refund: isSuperAdmin,
  },

  reports: {
    view: isSuperAdminOrAdmin,
    generate: (req) => {
      const { type } = req.body;

      //! restrict with only superadmin able to generate
      if (["financial", "revenue"].includes(type)) {
        return isSuperAdmin(req);
      }

      //! "occupancy" and "cancellation" allow to generate by both administrator role
      return isSuperAdminOrAdmin;
    },
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
    view: isSuperAdminOrAdmin,
    update: isSuperAdmin,
    create: isSuperAdmin,
  },
  rewardPoints: {
    update: isSuperAdmin,
    create: isSuperAdmin,
    delete: isSuperAdmin,
  },
  settings: {
    update: isSuperAdmin,
    view_user_activity_tracking: isSuperAdmin,
    view: isSuperAdminOrAdmin,
  },
};

export default policies;
