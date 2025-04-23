import express from 'express';
import { getStudentGrades } from '../controllers/gradeController.js';

const router = express.Router();

router.get('/', getStudentGrades);

export default router;
