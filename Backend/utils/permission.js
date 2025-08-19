const permissions = {
  admin: {
    profile: ["update", "view"],
    users: ["update", "view"],
    booking: ["view_all", "view", "update_booking_status", "view_own"],
    payments: ["view_all", "update_payment_status"],
    reports: ["generate", "view"],
    rooms: ["view_all"],
    events: ["view_all", "update_event_status"],
    amenities: ["view_all"],
    rateAndReview: ["create"],
    OTP: ["view"],
    settings: ["view"]
  },

  superAdmin: {
    profile: ["update", "view"],
    users: ["update", "view", "delete"],
    booking: [
      "view_all",
      "view",
      "cancel_any",
      "update_booking_status",
      "view_own",
    ],
    rooms: ["view_all", "create_room", "delete_room", "update_room"],
    payments: ["view_all", "approve_refund", "update_payment_status"],
    reports: ["view", "generate"],
    assignRole: ["update", "delete", "create"],
    amenities: ["create", "update", "delete", "view_all"],
    events: ["view_all", "update_event_status", "reject_event_status"],
    OTP: ["view", "update", "create"],
    rateAndReview: ["create"],
    rewardPoints: ["update", "create", "delete"],
    settings: ["update", "view"]
  },

  user: {
    booking: ["view_own"],
    rateAndReview: ["create"],
  },
};

export default permissions;