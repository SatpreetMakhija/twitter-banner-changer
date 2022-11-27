const path = require('path');
const Queue = require('bull');
require('dotenv').config();

// console.log("bull here")
const myFirstQueue = new Queue('my-first-queue', process.env.REDIS_URL);
myFirstQueue.on('error', (err) => console.log(err));
console.log(typeof(process.env.REDIS_URL))
// console.log("after queue")
// myFirstQueue.add({name: "John", age: 30});

// myFirstQueue.process((job, done) => {
//     console.log(job.data);
//     done();
// })