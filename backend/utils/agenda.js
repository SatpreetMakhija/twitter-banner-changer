const Agenda = require("agenda");
const User = require('../models/user-model');
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL,
    collection: "TwitterBannerChangeAPICallsQueue",
  },
  processEvery: "5 seconds",
});


//define job
require('../jobs/changeBanner')(agenda);

agenda.on("success:change twitter banner", (job) => {
  const albumId = job.attrs.data.albumId;
  const userId = job.attrs.data.userId;
  const bannersURLsCounterAtPrevJob = job.attrs.data.bannersURLsCounter;
  const user = User.findById(userId).exec();
  user.then((user) => {
    const album = user.albums.find((album) => album._id.toString() === albumId);
    /**
     * Set bannersURLsCounter to 0 if reached end of album array.
     */
    if (bannersURLsCounterAtPrevJob < album.bannersURLs.length - 1) {
      // add job with increase in counter

      agenda.schedule(
        `${album.frequencyOfUpdateInHours.toString()} hour`,
        "change twitter banner",
        {
          userId: userId,
          albumId: albumId,
          bannersURLsCounter: bannersURLsCounterAtPrevJob + 1,
        }
      );
    } else {
      //add job with counter set to 0.
      agenda.schedule(
        `${album.frequencyOfUpdateInHours.toString()} hour`,
        "change twitter banner",
        { userId: userId, albumId: albumId, bannersURLsCounter: 0 }
      );
    }
  });
});


agenda.on("fail:change twitter banner", (err, job) => {
  //save error at some place for further analysis. But, still move to the next albumURL.
  //TODO Save error at some database.
  const albumId = job.attrs.data.albumId;
  const userId = job.attrs.data.userId;
  const bannersURLsCounterAtPrevJob = job.attrs.data.bannersURLsCounter;
  const user = User.findById(userId).exec();
  user.then((user) => {
    const album = user.albums.find((album) => album._id.toString() === albumId);
    /**
     * Set bannersURLsCounter to 0 if reached end of album array.
     */
    if (bannersURLsCounterAtPrevJob < album.bannersURLs.length - 1) {
      // add job with increase in counter

      agenda.schedule(
        `${album.frequencyOfUpdateInHours.toString()} hour`,
        "change twitter banner",
        {
          userId: userId,
          albumId: albumId,
          bannersURLsCounter: bannersURLsCounterAtPrevJob + 1,
        }
      );
    } else {
      //add job with counter set to 0.
      agenda.schedule(
        `${album.frequencyOfUpdateInHours.toString()} hour`,
        "change twitter banner",
        { userId: userId, albumId: albumId, bannersURLsCounter: 0 }
      );
    }
  });
});


module.exports = agenda;

