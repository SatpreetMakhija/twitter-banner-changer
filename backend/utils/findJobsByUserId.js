const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const config = require('../config');
const client = new MongoClient(config.MONGODB_URL);
async function findJobsByUserId(userId, numberOfJobs = 5) {
  await client.connect();
  const db = client.db("test");
  const collection = db.collection("TwitterBannerChangeAPICallsQueue");
  const userJobs = await collection
    .find({
      "data.userId": ObjectId(userId),
      lastFinishedAt: { $exists: true },
    })
    .sort({lastFinishedAt: -1})
    .limit(numberOfJobs)
    .toArray();
  return userJobs;
}

module.exports = findJobsByUserId;
