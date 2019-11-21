import { User } from "../../schema/user/user.model";
import { generateHash, compareHash } from "../../common/encryption";
import { JWTRepository } from "../../common/jwt";
import { toObjectId } from "../../common/mongoose";
import { fromGlobalId } from "graphql-relay";

class UserRepository {
  private static instance: UserRepository;

  async findUserById(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  async register({
    email,
    password,
    firstName,
    lastName
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return { status: "FAILED", message: "User already exists!" };
    }

    const user = new User({
      email,
      password: generateHash(password),
      firstName,
      lastName
    });

    await user.save();

    return { status: "SUCCESS", message: "User created successfully!" };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: "FAILED", message: "User not found!" };
    }

    if (compareHash(user.password, password)) {
      const token = `Bearer ${JWTRepository.getInstance().generateToken(
        `${user._id}`
      )}`;

      return {
        status: "SUCCESS",
        message: "user logged in successfully!",
        token
      };
    } else {
      return { status: "FAILED", message: "Invalid password!" };
    }
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }
}

export { UserRepository };
