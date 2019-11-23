import { User } from "../../schema/user/user.model";
import { generateHash, compareHash } from "../../common/encryption";
import { JWTRepository } from "../../common/jwt";
import { toObjectId } from "../../common/mongoose";
import { fromGlobalId, toGlobalId } from "graphql-relay";
import { availableThemes } from "../../graphql/user/user.queries";
import pubSub from "../../graphql/publisher";
import { USER_SUBSCRIPTION_TRIGGERS } from "../../common/constants/subscriptions";
import { GLOBAL_ID_TYPES } from "../../graphql/globalIdTypes";

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

  async changeTheme({ userId, index }: { userId: string; index: number }) {
    const res = await User.findOneAndUpdate(
      { _id: toObjectId(userId) },
      { theme: index },
      { new: true }
    );

    if (!res) {
      throw new Error("Unable to change theme");
    }
    pubSub.publish(
      `${USER_SUBSCRIPTION_TRIGGERS.USER_CHANGED_THEME}_${toGlobalId(
        GLOBAL_ID_TYPES.User,
        userId
      )}`,
      { theme: availableThemes[index] }
    );
    return { theme: availableThemes[index] };
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
