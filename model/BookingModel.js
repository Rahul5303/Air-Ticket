const mongoose= require("mongoose");

const bookingSchema= new mongoose.Schema({
    user : { type: ObjectId, ref: 'User' },
    flight : { type: ObjectId, ref: 'Flight' }
})

const BookingModel=mongoose.model("booking",bookingSchema);

module.exports={BookingModel};