import express from 'express'
const router =express.Router();
import { protect ,admin } from '../middleware/authMiddleware.js';
import { auth ,getalluser ,logout ,
    userRegistration,getuserprofile ,
    updateUserProfle ,deleteUser ,getUserById ,updateUserById} from '../controllers/userController.js';



router.route('/auth').post(auth)
router.route('/register').post(userRegistration);
router.route('/getusers').get(protect,admin,getalluser)
router.route('/logout').post(protect,logout);
router.route('/register').post(userRegistration);
router.route('/profile').get(protect ,getuserprofile)
router.route('/update').put(protect ,updateUserProfle)
router.route('/getuserbyid/:id').get(protect ,admin ,getUserById)
router.route('/delete/:id').delete(protect ,admin ,deleteUser)
router.route('/updateuserbyid/:id').put(protect ,admin ,updateUserById)





export default router;