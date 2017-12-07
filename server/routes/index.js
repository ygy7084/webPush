import express from 'express';
import webPush from './webPush';

const router = express.Router();

router.use('/webPush', webPush);

export default router;