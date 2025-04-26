const { Router } = require('express');
const userController = require('../controllers/userController');
const petsController = require('../controllers/petsController');
const sendEmailController = require('../controllers/sendEmailController');
const adminController = require('../controllers/adminController');

const router = Router();



router.get("/users/:id", userController.getuser)

router.get("/allPets", petsController.getpets)

router.get("/pet/:id", petsController.getPetWithId)

router.delete("/pet/:id", petsController.DeletePetWithId)

router.post("/addUser", userController.signup)

router.post("/loginUser", userController.login);

router.post("/addPet", petsController.addPet)

router.post("/addPetRequest/:id", petsController.addRequestOnPet)

router.put("/updateRequest/:id", petsController.updatePetRequest)

router.put("/removePetRequest/:id", petsController.removePetRequest)

router.post("/users/addrequestedPet/:id", petsController.addRequestedPetToUserRequestedPetsList)

router.post("/users/addNotification/:id", userController.addNotificationToUser)

router.delete("/users/deleteNotifications/:id", userController.deleteNotifications)

router.post("/sendEmail", sendEmailController.sendEmail)

router.post("/sendVerification", adminController.sendVerification)

router.get("/getVerifications", adminController.getVerifications)

router.put("/updateVerificationStatus", adminController.updateVerificationStatus)

module.exports = router;