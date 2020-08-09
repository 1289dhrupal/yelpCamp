const mongoose              = require("mongoose"),
    passPortLocalMongoose   = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
 userSchema.plugin(passPortLocalMongoose);
module.exports = mongoose.model("User", userSchema);