import express from "express";
import facilityController from "../controllers/facility.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import verifyRole from "../middleware/verifyRoles.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get(
  "/",
  facilityController.getFacility
);

router.get(
  "/facility/:facilityId",
  facilityController.getCertainFacility
);

router.use(rateLimiter("facility_protected_global", 30, 60), protectRoute, verifyRole);
router.get("/paginated", facilityController.getAdminPageFacility);
router.post(
  "/create-facility",
  rateLimiter("create_facility", 10, 60),
  facilityController.createFacility
);
router.patch(
  "/update-facility-status/:facilityId",
  rateLimiter("update_facility_status", 10, 60),
  facilityController.updateFacilityStatus
);
router.delete(
  "/delete-facility/:facilityId",
  rateLimiter("delete_facility", 5, 60),
  facilityController.deleteFacility
);
router.put(
  "/update-facility/:facilityId",
  rateLimiter("update_facility", 10, 60),
  facilityController.updateFacility
);

export default router;
