import express from "express";
import facilityController from "../controllers/facility.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import verifyRole from "../middleware/verifyRoles.js";
const app = express();
const router = express.Router();

router.get("/", facilityController.getFacility);
router.get("/facility/:facilityId", facilityController.getCertainFacility)
router.get("/paginated", facilityController.getAdminPageFacility);

router.use(protectRoute, verifyRole);
router.post("/create-facility", facilityController.createFacility);
router.patch(
  "/update-facility-status/:facilityId",
  facilityController.updateFacilityStatus
);
router.delete(
  "/delete-facility/:facilityId",
  facilityController.deleteFacility
);
router.put("/update-facility/:facilityId", facilityController.updateFacility);

export default router;
