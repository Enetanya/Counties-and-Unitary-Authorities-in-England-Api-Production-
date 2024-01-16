
const mongoose = require('./connection.js');

// User schema and model
const userSchema = new mongoose.Schema({ 
    id: { 
        type: String, 
        required: true, 
        minlength: 8, 
        validate: { validator: function(value) { 
            return /^[a-zA-Z]{8,}$/.test(value); 
        }, 
        message: props => `${props.value} is not a valid ID. 
        The ID should be at least 8 characters long and contain only letters.` 
    } 
}, 
        password: { 
            type: String, 
            required: true, 
            minlength: 8, 
            validate: { validator: function (value) { 
                return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value); 
            }, message: props => `${props.value} is not a valid password!
             Password must contain at least one letter, one number, 
            one special character, and be at least 8 characters long.` 
        } 
    }, email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: { validator: function (value) { 
            return /\S+@\S+\.\S+/.test(value); 
        }, 
            message: props => `${props.value} is not a valid email address!` 
        } 
    }}
    );
const User = mongoose.model('User', userSchema, 'Details');


// Export the router instance
module.exports = User;


