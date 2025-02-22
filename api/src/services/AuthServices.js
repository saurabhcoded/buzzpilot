const models = require('../models/index');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

exports.GenerateVerifyUrl = async (prefix, id) => {
    try {
        if (!prefix || !id) {
            return {status: false};
        }
        let user = await models.users.findOne({
            where: {
                id: id,
                deleted: 0
            }
        });
        if (!user) {
            return {status: false, message: 'User Does Not exists'}
        }

        /* TODO: Change buffer from name to uuid */
        // let verificationToken = Buffer.from(user.firstName + user.id).toString(
        //     "base64"
        // );

        // Generate a random UUID (Version 4)
        const verificationToken = uuidv4();

        let verificationLink = prefix + verificationToken;

        user.verification_token = verificationToken;
        await user.save();

        return {status: true, verificationLink: verificationLink};

    } catch (error) {
        console.log('Error in catch block  : ', error)
    }
}


exports.ValidateVerifyUrl = async (verificationToken, update) => {
    try {
        // sequelize.models.users
        let user = await models.users.findOne({
            where: {
                verification_token: verificationToken
            }
        });

        if (!user) {
            return {status: false, message: ' Either Verification Link is expired or User does not exists . Please try after some time '}
        }

        if (update && Array.isArray(update)) {
            update.forEach((up) => {
                if (up.field && up.value) {
                    user[up.field] = up.value;
                }
            })
        };

        // let hashPassword = await bcrypt.hash(data.password, 12);

        // user.password = hashPassword;
        user.verification_token = null;
        await user.save();

        return {status: true, user: user}


    } catch (error) {
        console.log('Error in catch block  : ', error);
        return {status: false}
    }


}

exports.generateHash = async (password) => {
    const hashedStr = await bcrypt.hash(password, 12);
    return hashedStr;
}


exports.generateJWTAccessToken = async (userId) => {
    try {
        if (userId && userId !== '') {
            const JWT_SECRET = process.env.JWT_SECRET || "HH5u6mKP9sljSVi";
            const accessToken = jwt.sign(
                {userId: userId},
                JWT_SECRET,
                {
                    algorithm: "HS256",
                    expiresIn: "16d",
                }
            );
            return accessToken;
        }
        return null;
    } catch (error) {
        console.log('errorWhileGeneratingJWT and error is : ', error)
        return null;
    }
}

exports.comparePassword = async (oldPassword, password) => {
    try {
        if (oldPassword && password) {
            const validPassword = await bcrypt.compare(oldPassword, password);
            return validPassword
        }
        return false;
    } catch (error) {
        console.log('error while comparing password : ', error)
        return false;
    }
}
