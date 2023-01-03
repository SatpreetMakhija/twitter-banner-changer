const User = require('../models/user-model');

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


module.exports = {createAlbumController};
