const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    name:{
        type: String,
        required: true,
    },

    cityId:{
        type:Schema.Types.ObjectId,
        ref:"City",
    },
    stateId:{
        type:Schema.Types.ObjectId,
        ref: "State"
    },
    pinCode:{
        type:Number,
        required:true,
        unique:true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Area', areaSchema);