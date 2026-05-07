const Joi = require('joi');

/**
 * Validation middleware using Joi
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

/**
 * Resume upload validation schema
 */
const resumeUploadSchema = Joi.object({
  // No body validation needed for file uploads
  // File validation is handled by multer middleware
});

/**
 * Profile update validation schema
 */
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  title: Joi.string().min(2).max(100).trim(),
  bio: Joi.string().max(500).trim(),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).trim(),
  location: Joi.string().max(100).trim(),
  profileImage: Joi.string().uri().allow(''),
  backgroundImage: Joi.string().uri().allow(''),
  socialLinks: Joi.object({
    linkedin: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow(''),
    website: Joi.string().uri().allow('')
  }),
  skills: Joi.array().items(Joi.string().trim()).max(50),
  experience: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      company: Joi.string().required(),
      duration: Joi.string().required(),
      description: Joi.string().max(500)
    })
  ),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      year: Joi.string().required(),
      gpa: Joi.string().allow('')
    })
  )
});

/**
 * Project validation schema
 */
const projectSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().trim(),
  description: Joi.string().max(500).required().trim(),
  technologies: Joi.array().items(Joi.string().trim()).min(1).max(20),
  githubUrl: Joi.string().uri().allow(''),
  liveUrl: Joi.string().uri().allow(''),
  imageUrl: Joi.string().uri().allow(''),
  featured: Joi.boolean().default(false)
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required()
});

/**
 * Registration validation schema
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' })
});

module.exports = {
  validate,
  schemas: {
    resumeUpload: resumeUploadSchema,
    profileUpdate: profileUpdateSchema,
    project: projectSchema,
    login: loginSchema,
    register: registerSchema
  }
};