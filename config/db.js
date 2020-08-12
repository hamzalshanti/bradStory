const mongoose = require('mongoose');

//connectWith database 
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, { 
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`MONGODB CONNECT ${conn.connection.host} IN '${process.env.NODE_ENV}' ENVIROMINT`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    
}

module.exports = connectDB;