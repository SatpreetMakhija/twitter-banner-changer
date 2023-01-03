const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');
const {createAlbumController, getAlbumController} = require('../controllers/albumControllers');
const {upload:uploadPhotos} = require('../middlewares/uploadFiles');
router.post("/create-album", authCheck, uploadPhotos.array("banners"), createAlbumController);
router.get("/:albumid", authCheck, getAlbumController);

module.exports = router;
