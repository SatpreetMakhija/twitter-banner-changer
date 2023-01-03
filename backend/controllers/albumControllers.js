const User = require("../models/user-model");

const createAlbumController = (req, res, next) => {
  const bannersURLs = req.files.map((file) => {
    //slice to remove substring prefix 'uploads/'
    return file.path.slice(8);
  });
  const album = {
    albumName: req.body.albumname,
    createdOn: new Date(),
    bannersURLs: bannersURLs,
    frequencyOfUpdateInHours: null,
  };

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { albums: album } },
    function (error, success) {
      if (error) {
        res.status(500);
        res.send({ message: "An error occured while creating the album" });
      } else {
        res.send({ message: "Album created successfully" });
      }
    }
  );
};

const getAlbumController = (req, res, next) => {
  const albumId = req.params.albumid;
  User.findById(req.user._id, (err, user) => {
    if (err) {
      console.log("Could not find a user with this user id");
    } else {
      let album = user.albums.find((album) => album._id.toString() === albumId);
      if (album) {
        if (albumId == user.currentAlbumInRotation) {
          res.send({ album: album, isCurrentAlbumInRotation: true });
        } else {
          res.send({ album: album, isCurrentAlbumInRotation: false });
        }
      } else {
        res.status(404);
        res.send({ message: "You don't have an album with this id" });
      }
    }
  });
};

module.exports = { createAlbumController, getAlbumController };
