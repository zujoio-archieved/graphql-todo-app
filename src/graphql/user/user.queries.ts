import GraphQLUser from "./user.typeDef";
import { iContext } from "../../serverConfig/context";

export const availableThemes = [
  {
    index: 0,
    name: "Blue",
    primary: "#2196F3",
    dark: "#0D47A1",
    light: "#BBDEFB"
  },
  {
    index: 1,
    name: "Pink",
    primary: "#E91E63",
    dark: "#880E4F",
    light: "#F8BBD0"
  },
  {
    index: 2,
    name: "Deep Purple",
    primary: "#673AB7",
    dark: "#311B92",
    light: "#D1C4E9"
  }
];

const GraphQLUserQueries = {
  viewer: {
    type: GraphQLUser,
    resolve: async (info: any, args: any, ctx: iContext) => {
      let userId: any;

      try {
        const uid: any = await ctx.getUserId();
        userId = uid.userId;
      } catch (err) {}

      console.log({ userId });

      if (userId) {
        const user: any = await ctx._userRepository.findUserById(userId);
        // return user;
        return {
          theme: availableThemes[user.theme ? user.theme : 0],
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          availableThemes
        };
      } else {
        return { id: null };
      }
    }
  }
};

export { GraphQLUserQueries };
