const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPass } = require('../helpers')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name required']
    },
    email: {
        type: String,
        required: [true, 'email required'],
        validate: [{
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'wrong email format'
        }, {
            isAsync: true,
            validator: function(v, cb) {
                User
                    .findOne({email: v, _id: {$ne: this._id}})
                    .then(user => {
                        if (user) {
                            cb(false)
                        } else {
                            cb(true)
                        }
                    })
                    .catch(err => {
                        cb(false)
                    })
            },
            message: "email already used"
        }],
    },
    password: {
        type: String,
        required: [true, 'password required']
    },
    tags: []
})

userSchema.pre('save', function(next) {
    this.password = hashPass(this.password)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User