const jwt = require('jsonwebtoken')
const db = require('../models/index')
const {commonConfig} = require('../config/config')
const User = db.users


exports.isAuth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length)
        }
        if (token) {
            let JWT_SECRET = commonConfig.jwtSecret;
            jwt.verify(token, JWT_SECRET,
                async (err, decoded) => {
                    if (err) {
                        return res.json({
                            status: 401,
                            message:
                                'You need to be logged in to access this route',
                        })
                    } else {
                        // console.log("Request Token Decoded", decoded)
                        let userId = decoded.userId;
                        let options = {
                            where: {
                                id: userId,
                                // deleted: 0
                            },
                            // include: [
                            //     {association: "userRole", include: [{association: "role"}]},
                            //     {
                            //         required: false,
                            //         association: "userSkill",
                            //         where: {
                            //             deleted: 0,
                            //         },
                            //         include: [
                            //             {
                            //                 association: "skillInterest",
                            //             },
                            //         ],
                            //     },
                            // ],
                        }
                        const userData = await User.findOne(options)
                        if (userData) {
                            let user = userData

                            if (user && userId) {
                                // Check Email Active or Not
                                if (user.activeStatus == 0) {
                                    return res.json({
                                        status: 0,
                                        message: 'Your Account is not active.',
                                    })
                                }

                                req.userId = userId
                                req.userName =
                                    user.firstName + ' ' + user.lastName
                                req.user = user
                                // req.level = user?.userRole?.role?.level
                                // req.branchAccessList = branchAccessList;
                                delete req.headers.authorization;
                                next()
                            } else {
                                return res.json({
                                    status: 401,
                                    message: 'User Not Exist',
                                })
                            }
                        } else {
                            return res.send({
                                status: 401,
                                // message: req.__('user do not exist'),
                                message: 'user do not exist',
                            })
                        }
                    }
                }
            )
        } else {
            return res.json({
                status: 401,
                message: 'Auth token is not supplied',
            })
        }
    } else {
        return res.json({
            status: 401,
            message: 'Auth token is not supplied',
        })
    }

}
