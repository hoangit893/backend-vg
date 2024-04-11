import argon2 from "argon2";
const jwt = require("jsonwebtoken");
import User from "../models/User.model";
import { config } from "../configs/config";
import { hideSensitiveData, sender } from "../helpers/utils";
import { userUpdateValidation } from "../helpers/validation_schema";

// const validateInput = (req: Request) => {
//   const error: any = {};

//   let username = req.body.username?.trim();
//   if (!username) {
//     error["username"] = "Username is required";
//   } else if (username.length < 6) {
//     error["username"] = "Username must be at least 6 characters";
//   } else if (username.split(" ").length > 1) {
//     error["username"] = "Username must not contain spaces";
//   }

//   let name = req.body.name?.trim();
//   if (!name) {
//     error["name"] = "Name is required";
//   } else if (name.length < 6) {
//   }

//   let email = req.body.email?.trim();
//   if (!email) {
//     error["email"] = "Email is required";
//   }

//   let password = req.body.password?.trim();
//   if (!password) {
//     error["password"] = "Password is required";
//   } else if (password.length < 8) {
//     error["password"] = "Password must be at least 8 characters";
//   } else if (password.split(" ").length > 1) {
//     error["password"] = "Password must not contain spaces";
//   } else if (
//     password.search(/[a-z]/) < 0 ||
//     password.search(/[A-Z]/) < 0 ||
//     password.search(/[0-9]/) < 0 ||
//     password.search(/[!@#$%^&*]/) < 0
//   ) {
//     error["password"] =
//       "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
//   }
//   return error;
// };

const findByUsername = async (username: string) => {
  const user = await User.findOne({ username: username });
  if (!user) {
    return {
      status: 400,
      message: "User not found",
    };
  }
  return hideSensitiveData(user);
};

const isExistUser = async (username: String, email?: String) => {
  const user = await User.findOne({}).or([
    { username: username },
    { email: email },
  ]);
  return user;
};

const createUserService = async ({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const user = new User({
    name,
    username,
    email,
    password: await argon2.hash(password),
  });

  await user.save();

  const token = jwt.sign({ username: user.username }, config.jwt.secret);
  return {
    status: 200,
    message: {
      username: user.username,
      token: token,
    },
  };
};

const loginUserService = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await isExistUser(username);
  if (user) {
    const match = await argon2.verify(user.password, password);
    if (match) {
      const token = jwt.sign(
        { username: user.username, role: user.role },
        config.jwt.secret
      );
      return {
        status: 200,
        message: {
          username: user.username,
          role: user.role,
          user: hideSensitiveData(user),
          token: token,
        },
      };
    } else {
      return {
        status: 400,
        message: "Wrong username or password",
      };
    }
  } else {
    return {
      status: 400,
      message: "Wrong username or password",
    };
  }
};

const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return {
      status: 400,
      message: "User not found",
    };
  }
  const token = await jwt.sign({ email: user.email }, config.jwt.secret, {
    expiresIn: "1h",
  });

  const mailOptions = {
    from: "hhoang.it@hotmail.com",
    to: email,
    subject: "Reset password",
    html: `<h2>Please click on the link below to reset your password</h2>
    <a href="http://localhost:5173/reset-password/?token=${token}">Reset password</a>`,
  };
  let info = await sender.sendMail(mailOptions);
  if (info.rejected.length > 0) {
    return {
      status: 500,
      message: "Error sending email",
    };
  } else {
    return {
      status: 200,
      message: "Email sent",
    };
  }
};

const resetPasswordService = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  if (!token || !password) {
    return {
      status: 400,
      message: "Token and password are required",
    };
  }
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return {
        status: 400,
        message: "User not found",
      };
    }
    user.password = await argon2.hash(password);
    await user.save();
    return {
      status: 200,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Invalid token",
    };
  }
};

const updateUserService = async (
  id: string,
  updateData: {
    name?: string;
    email?: string;
    password?: string;
    avatarImg?: string;
    bio?: string;
  }
) => {
  const { error } = userUpdateValidation.validate(updateData);
  if (error) {
    return {
      status: 400,
      message: error.details[0].message,
    };
  }

  const user = await User.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  if (!user) {
    return {
      status: 400,
      message: "User not found",
    };
  } else {
    return {
      status: 200,
      message: "User updated successfully",
      data: hideSensitiveData(user),
    };
  }
};

export {
  createUserService,
  findByUsername,
  isExistUser,
  loginUserService,
  forgotPasswordService,
  resetPasswordService,
  updateUserService,
};
