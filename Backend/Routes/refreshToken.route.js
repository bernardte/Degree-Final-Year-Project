import express from 'express';
import refreshTokenControllers from '../controllers/refreshToken.controller.js';

const router = express.Router();

router.post("/refresh-token", refreshTokenControllers.handleRefreshToken);

export default router;