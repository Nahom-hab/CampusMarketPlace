import express from 'express';
import {
    createFeedback,
    getFeedbacks
} from '../controller/feedback.controller.js'
import { isAdmin } from '../middelwere/isAdmin.js';

const router = express.Router();



router.post('/', createFeedback);
router.get('/', isAdmin, getFeedbacks);



export default router;
