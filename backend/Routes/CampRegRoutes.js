const express=require("express")
const router=express.Router()
const {createCamp,getCamp}=require("../Controllers/CampRegController")

// router.post('/createCamp',CampRegController.createCamp)

// Route to register a new camp
router.post("/createCamp", createCamp);

// Route to get all camps
router.get("/getCamp", getCamp);

module.exports=router;