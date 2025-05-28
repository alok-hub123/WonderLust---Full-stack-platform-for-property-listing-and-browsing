const mongoose  = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const url = 'mongodb://localhost:27017/wonderlust';

main()
.then(()=>
{
    console.log('Connected to MongoDB');
})
.catch((err)=>
{
    console.log('Error connecting to MongoDB', err);
});

async function main()
{
    await mongoose.connect(url);
}

async function initDatabase()
{
    await Listing.deleteMany({});
    initData = initData.data.map((obj) => ({...obj, owner: "652d0081ae547c5d37e56b5f"}));
    await Listing.insertMany(initData.data);
    console.log('Database seeded');
}

initDatabase();