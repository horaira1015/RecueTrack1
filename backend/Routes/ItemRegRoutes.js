const express = require("express");
const router = express.Router();
const { registerItem, getItems,getAllItemDetails,getItemsByCategory,getItemsByCategoryAndCamp ,getItemsGroupedByCategory} = require("../Controllers/ItemRegController");


router.post("/registerItem", registerItem);
router.get("/getItems/:campId", getItems);
router.get("/category/:categoryId", getItemsByCategory); 
router.get("/category/:categoryId/camp/:campId", getItemsByCategoryAndCamp);
router.get("/bycategory", getItemsGroupedByCategory);
router.get("/details", getAllItemDetails);




module.exports = router;
