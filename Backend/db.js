const mongoose = require('mongoose')
const {Schema} = mongoose;
const zod = require('zod')
mongoose.connect('mongodb+srv://sanyamjainhbtu:Sm%40sterjain04@cluster0.rcz8e.mongodb.net/paytm').then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const userZodSchema = zod.object({
    firstName : zod.string().min(3,{ message: "Must be 3 or more characters long" }),
    lastName : zod.string().min(3,{ message: "Must be 3 or more characters long" }),
    username: zod.string().email({ message: "Invalid email address" }),
    password: zod.string().min(8, { message: "Password must be at least 8 characters long" })
    })

const userSchema = new Schema({
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        username : {
            type : String,
            required : true,
            unique: true
        },
        password : {
            type : String,
            required : true
        }
})
const User = mongoose.model("User", userSchema)

async function createUser(userData){
    try {
        const validateData = userZodSchema.parse(userData);
        const newUser = new User(validateData);
        await newUser.save();
        console.log("user created successfully:",newUser)
    } catch (error) {
        if(error instanceof zod.ZodError){
            console.log("Validation Errors:", error.errors)
        }else{
            console.log("Error creating user:", error)
        }
    }
}

const accountSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance: {
        type : Number,
        required : true
    }
})
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account

}