const User = require("../models/user-model");
const agenda = require('../utils/agenda');
const fs = require('fs');
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

const setAlbumController = async (req, res, next) => {
    const userId = req.user._id;
    const bannersURLsCounter = 0;
    const albumId = req.body.albumId;
    const bannerUpdateFrequency = req.body.bannerUpdateFrequency;
  
    // Find album in Users collection and set the frequencyOfUpdateInHours key's value to bannerUpdateFrequency obtained in req.body
    // Set user.currentAlbumIn Rotation to albumId;
    // Add the album to the API Calls queue.
  
    User.findById(userId, async function (err, user) {
      if (err) {
        next(err);
      } else {
        user.albums.find(
          (album) => album._id.toString() === albumId
        ).frequencyOfUpdateInHours = Number(bannerUpdateFrequency);
        user.currentAlbumInRotation = String(albumId);
        await user.save();
        agenda
          .start()
          .then(() => {
            agenda.now("change twitter banner", {
              userId: userId,
              albumId: albumId,
              bannersURLsCounter: 0,
            }).then(() => res.send({message: "Album Set"}));
            //TODO Success Response gets sent even if the job fails. See how to fix this. 
            // res.send({ message: "Album Set." });
          })
          .catch((err) => {
            res.status(404);
            res.send({
              message: "An error occured. Album could not be set. Try again.",
            });
          });
        }
    });
  
  };

  const deleteAlbumController = async (req, res, next) => {
    const albumId = req.body.albumId;
    //find the album with this id, if doesn't exist show you don't have an album with this id.
    // first delete images with the given url of the body.
    // delete the album from the user's album and send the respnse.
    const userId = req.user._id;
    const currentAlbumInRotation = req.user.currentAlbumInRotation;
  
    if (currentAlbumInRotation && currentAlbumInRotation == albumId) {
      //Remove the next API call from the queue.
      const jobs = await agenda.jobs({ name: "change twitter banner"});
      jobs.forEach((job) => {
        if (job.attrs.data.albumId == albumId && job.attrs.lastRunAt == null) {
          job.remove();
        }
      });
    }
    User.findById(userId, async function (err, user) {
      if (err) {
        res.status(404);
        res.json({ message: "Error. Could not find the user" });
      } else {
        const album = user.albums.find(
          (album) => album._id.toString() === albumId
        );
        if (album) {
          //for each bannersURLs, call fs.unlink.
          for (let i = 0; i < album.bannersURLs.length; i++) {
            fs.unlink(
              process.cwd() + "/uploads/" + album.bannersURLs[i],
              (err) => {
                if (err) {
                  console.log("Error occured.");
                }
              }
            );
          }
  
          //remove the album from the user model.
          User.findOneAndUpdate(
            { _id: userId },
            { $pull: { albums: { _id: albumId } } },
            function (error, success) {
              if (error) {
                res.status(404);
                res.json({ message: "An error occured." });
              } else {
                res.status(200);
                res.send({ messsage: "Album deleted successfully" });
              }
            }
          );
        } else {
          res.status(404);
          res.json({ message: "User does not have an album with this id." });
        }
      }
    });
  }

module.exports = { createAlbumController, getAlbumController, setAlbumController, deleteAlbumController };
