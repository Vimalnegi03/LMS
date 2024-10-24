import express from 'express'
import { getallCourses,getLecturesbyCourseId,createCourse,updateCourse,deleteCourse, addLecturesToCourseById,removeLectureFromCourse } from '../controller/courseController.js';
import { isLoggedIn } from '../middleware/auth_middleware.js';
import { authorizedRoles } from '../middleware/auth_middleware.js';
import { authorizedSubscirbers } from '../middleware/auth_middleware.js';
import upload from '../middleware/multer_middleware.js';
const courseRoutes=express.Router();
courseRoutes.get('/',getallCourses);
courseRoutes.get('/:id',isLoggedIn,authorizedSubscirbers,getLecturesbyCourseId)
courseRoutes.delete('/',isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);

courseRoutes.post('/',isLoggedIn,authorizedRoles('ADMIN'),upload.single('thumbnail'),createCourse);
courseRoutes.put('/:id',isLoggedIn,authorizedRoles('ADMIN'),updateCourse);
courseRoutes.delete('/:id',isLoggedIn,authorizedRoles('ADMIN'),deleteCourse);
courseRoutes.post('/:id',isLoggedIn,authorizedRoles('ADMIN'),upload.single('lecture'),addLecturesToCourseById)

export default courseRoutes;