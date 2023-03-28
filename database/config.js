const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        console.log('Database online');

    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to MongoDB');
    }


}

module.exports = {
    dbConnection
}