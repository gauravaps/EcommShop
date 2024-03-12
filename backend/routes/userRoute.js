import express from 'express'
const router =express.Router();
import { protect ,admin } from '../middleware/authMiddleware.js';
import { auth ,getalluser ,logout ,userRegistration,getuserprofile ,updateUserProfle} from '../controllers/userController.js';



router.route('/auth').post(auth)
router.route('/register').post(userRegistration);
router.route('/getusers').get(protect,admin,getalluser)
router.route('/logout').post(protect,logout);
router.route('/register').post(userRegistration);
router.route('/profile').get(protect ,getuserprofile)
router.route('/update').put(protect ,updateUserProfle)





export default router;