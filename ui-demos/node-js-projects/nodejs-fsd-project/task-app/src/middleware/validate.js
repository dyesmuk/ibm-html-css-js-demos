// ============================================================
// MODULE 11 — Authentication & Security
// middleware/validate.js
//
// Reusable Joi validation middleware factory.
// Usage: router.post('/register', validate(registerSchema), handler)
// ============================================================

/**
 * Returns an Express middleware that validates req.body
 * against the provided Joi schema.
 * @param {import('joi').Schema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }
  next();
};

export default validate;
