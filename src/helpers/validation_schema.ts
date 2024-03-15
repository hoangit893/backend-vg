import Joi from "joi";

const registerValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(8).max(30).required(),
  repeat_password: Joi.ref("password"),
  name: Joi.string().min(3).max(30).required(),
});

export { registerValidation };
