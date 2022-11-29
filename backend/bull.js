const path = require('path');
const Queue = require('bull');
require('dotenv').config();

// console.log("bull here")
const bannerChangeAPICallsQueue = new Queue('bannerChangeAPICallsQueue', process.env.REDIS_URL);
myFirstQueue.on('error', (err) => console.log(err));
console.log(typeof(process.env.REDIS_URL))

// myFirstQueue.add({name: "John", age: 30});
bannerChangeAPICallsQueue.add({})
// myFirstQueue.process((job, done) => {
//     console.log(job.data);
//     done();
// })