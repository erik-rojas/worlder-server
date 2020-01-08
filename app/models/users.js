const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require("moment")

const Schema = mongoose.Schema;

const Joi = require('joi');

const ROLES = ["admin", "mod", "seeker", "company"];
const STATUS = ["blocked", "active", "pending"];

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String },
    fullname: { type: String },
    username: { type: String },
    birthday: { type: Date },
    provider: {
        type: { type: String, enum: ['facebook', 'google'] },
        provider_id: { type: String, require: true },
        provider_access_token: { type: String, require: true },
    },
    role: { type: String, enum: ROLES, required: true },
    status: { type: String, enum: STATUS, default: STATUS[1] },
    reset_password_code: { type: String },
    reset_password_expires: { type: Date },
}, {
        timestamps: true,
    })

function validatePass(data) {
    const schema = {
        password: Joi.string().min(6).max(255),
    };
    return Joi.validate(data, schema);
}

/**
 * virtual
 */
UserSchema.virtual('created_at').get(function () {
    return moment(this.createdAt).format("DD-MM-YYYY hh:mm:ss");
})

/**
 * Method
 */
UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) 
        next(new Error('Email already exists, please try again'));
    else next(error);
});

const dfPass = bcrypt.hashSync("123123", 10);

const dataMigrate = [
    {
        email: 'admin@gmail.com',
        password: dfPass,
        role: ROLES[0]
    }
];

UserSchema.statics.getMigrateData = function () {
    return dataMigrate;
}
const User = mongoose.model('User', UserSchema);

exports.validatePass = validatePass;
exports.ROLES = ROLES;
exports.User = User;