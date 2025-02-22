const models = require('../models/index')

// check the change password validation ==========>
exports.changePasswordValidation = (oldPassword, password, confirmPassword) => {

    if (!oldPassword || !password || !confirmPassword) {
        return {
            status: 0,
            message: "All fields are required."
        };
    }
    if (oldPassword === password || password !== confirmPassword) {
        if (oldPassword === password) {
            return {
                status: 0,
                message: "New password cannot be the same as the old password."
            }
        }
        if (password !== confirmPassword) {
            return {
                status: 0,
                message: "Password and confirm password do not match."
            }
        }
    }
    return {
        status: 1,
        message: "success"
    }

}

exports.getSingleUserByEmail =async (email )=>{

    try {
        const excludedItems = ['password']
        
        const user = await models.users.findOne({
            where: { email: email , deleted : 0} , attributes : { exclude: excludedItems ? excludedItems : ['password', 'verification_token'] }
        })
    
        return user ;

    } catch (error) {
        console.log('Error in getting single user by email : ',error)
    }

   
}

exports.getSingleUserByID =async (userId , excludedItems)=>{

    try {
        
        const user = await models.users.findByPk(userId , {
            attributes: { exclude: excludedItems ? excludedItems : ['password', 'verification_token'] } , raw : true
        })
    
        return user ;

    } catch (error) {
        console.log('Error in getting single user by id : ',error)
    }
}

exports.getSingleUser =async (userId , excludedItems)=>{

    try {
        
        const user = await models.users.findByPk(userId , {
            attributes: { exclude: excludedItems ? excludedItems : ['password', 'verification_token'] }
        })
    
        return user ;

    } catch (error) {
        console.log('Error in getting single user by id : ',error)
    }
}

exports.saveNewUser =async (data)=>{

    try {
        
        const user = await models.users.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.hashedPassword,
            mobile: data.mobile,
        } , {raw : true});
    
        return user ;

    } catch (error) {
        console.log('Error in creating new user : ',error);
    }

  

}

exports.updateUser =async (updatedFields , userId)=>{

    try {
        
        const user = await models.users.update(updatedFields, {where : {id : userId} , returning: true });

        return user ;

    } catch (error) {
        console.log('Error in updating user : ',error)
    }

   

}
