const mongoose  = require('mongoose');
let initData = require('./data');
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
    initData.data = initData.data.map((obj) => ({...obj, owner: '6839bbdc83a3541a7e32129d'}));
    await Listing.insertMany(initData.data);
    console.log('Database seeded');
}

initDatabase();