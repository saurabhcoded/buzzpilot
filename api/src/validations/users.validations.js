const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Define validation schema
const UserValidationSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    'string.empty': 'FIRST_NAME_REQUIRED',
    'string.min': 'FIRST_NAME_MINIMUM_CHAR',
  }),
  lastName: Joi.string(),
  email: Joi.string().email().required().messages({
    'string.email': 'INVALID_MAIL',
    'string.empty': 'EMAIL_REQUIRED',
  }),
  password: Joi.string().min(8).regex(passwordRegex).required().messages({
    'string.empty': 'PASSWORD_REQUIRED',
    'string.min': 'PASSWORD_MINIMUM_CHAR',
    'string.pattern.base': 'PASSWORD_ALPHANUMERIC_VALIDATION'
  }),

  mobile: Joi.string().pattern(new RegExp('^[0-9]+$')).min(10).max(10).required().messages({
    'string.min': 'INVALID_MOBILE',
    'string.max': 'INVALID_MOBILE',
    'string.empty': 'MOBILE_REQUIRED',
    'string.pattern.base': 'INVALID_MOBILE'
  }),

});

// Define General User  Validation( which will be used during editing user) schema
const EditUserValidation = Joi.object({
  firstName: Joi.string().min(2).messages({
    'string.min': 'FIRST_NAME_MINIMUM_CHAR',
  }),
  lastName: Joi.string(),
  email: Joi.string().email().messages({
    'string.email': 'INVALID_MAIL',
  }),
  profilePicture: Joi.string().max(300).allow(null, ''),
  profile_desc: Joi.string().max(250),
  mobile: Joi.string().pattern(new RegExp('^[0-9]+$')).min(10).max(10).messages({
    'string.min': 'INVALID_MOBILE',
    'string.max': 'INVALID_MOBILE',
    'string.pattern.base': 'INVALID_MOBILE'
  }),

});

// Define validation schema
const PasswordValidation = Joi.object({
  password: Joi.string().min(8).regex(passwordRegex).required().messages({
    'string.empty': 'PASSWORD_REQUIRED',
    'string.min': 'PASSWORD_MINIMUM_CHAR',
    'string.pattern.base': 'PASSWORD_ALPHANUMERIC_VALIDATION'
  })
  // UnComment This Validations for a Strong Password Requirements
  /*  .pattern(new RegExp('^(?=.*[a-z])'))
      .pattern(new RegExp('^(?=.*[A-Z])'))
      .pattern(new RegExp('^(?=.*[@$!%*?&])'))
      .messages({
        'string.pattern.base': {
          '^(?=.*[a-z])': 'Password must contain at least one lowercase letter.',
          '^(?=.*[A-Z])': 'Password must contain at least one uppercase letter.',
          '^(?=.*[@$!%*?&])': 'Password must contain at least one special character.'
        }
      }) 
  */  ,
  confirmPassword: Joi.string().min(8).regex(passwordRegex).required().messages({
    'string.empty': 'PASSWORD_REQUIRED',
    'string.min': 'PASSWORD_MINIMUM_CHAR',
    'string.pattern.base': 'PASSWORD_ALPHANUMERIC_VALIDATION'
  })
});

/* Forgot Password Request Schema */
const ForgotPassValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid Email Address',
    'string.empty': 'Email is Required',
  })
});

/* Login Api Schema */
const LoginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid Email Address',
    'string.empty': 'Email is Required',
  }),
  password: Joi.string().min(8).regex(passwordRegex).required().messages({
    'string.empty': 'Password is Required',
    'string.min': 'Password must be more than 8 characters',
    'string.pattern.base': 'Password should be combination of Alphanumeric'
  })
});
/* CHange Password */
const ChangePassValidation = Joi.object({
  password: Joi.string().min(8).regex(passwordRegex).required().messages({
    'string.empty': 'PASSWORD_REQUIRED',
    'string.min': 'PASSWORD_MINIMUM_CHAR',
    'string.pattern.base': 'PASSWORD_ALPHANUMERIC_VALIDATION'
  })
  // UnComment This Validations for a Strong Password Requirements
  /*  .pattern(new RegExp('^(?=.*[a-z])'))
      .pattern(new RegExp('^(?=.*[A-Z])'))
      .pattern(new RegExp('^(?=.*[@$!%*?&])'))
      .messages({
        'string.pattern.base': {
          '^(?=.*[a-z])': 'Password must contain at least one lowercase letter.',
          '^(?=.*[A-Z])': 'Password must contain at least one uppercase letter.',
          '^(?=.*[@$!%*?&])': 'Password must contain at least one special character.'
        }
      }) 
  */
  ,
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    "any.only": "Password and Confirm Password must match"
  }),
  oldPassword: Joi.string().required().messages({
    "any.required": "Old Password Requried"
  })
});

module.exports = {UserValidationSchema, ChangePassValidation, PasswordValidation, EditUserValidation, LoginValidation, ForgotPassValidation};
