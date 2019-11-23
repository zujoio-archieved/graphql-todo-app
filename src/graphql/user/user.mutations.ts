import {
  mutationWithClientMutationId,
  fromGlobalId,
  toGlobalId
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import { iContext } from "../../serverConfig/context";
import { ThemeType } from "./user.typeDef";
import { isContext } from "vm";
import pubSub from "../publisher";
import { availableThemes } from "./user.queries";
import { GLOBAL_ID_TYPES } from "../globalIdTypes";
import { USER_SUBSCRIPTION_TRIGGERS } from "../../common/constants/subscriptions";

const GraphQLRegisterUserMutation = mutationWithClientMutationId({
  name: "register",
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  },
  mutateAndGetPayload: async (
    { email, password, firstName, lastName },
    ctx: iContext
  ) => {
    const { message, status } = await ctx._userRepository.register({
      email,
      password,
      firstName,
      lastName
    });
    return { status, message };
  }
});

const GraphQLLoginUserMutation = mutationWithClientMutationId({
  name: "login",
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  mutateAndGetPayload: async ({ email, password }, ctx: iContext) => {
    const { message, status, token } = await ctx._userRepository.login({
      email,
      password
    });
    return { message, status, token };
  }
});

const GraphqlChangeTheme = mutationWithClientMutationId({
  name: "changeTheme",
  inputFields: { index: { type: GraphQLInt } },
  outputFields: { theme: { type: ThemeType } },
  mutateAndGetPayload: async ({ index }, ctx: iContext) => {
    const { userId }: any = await ctx.getUserId();

    return ctx._userRepository.changeTheme({ userId, index });
  }
});

const GraphQLUserMutations = {
  register: GraphQLRegisterUserMutation,
  login: GraphQLLoginUserMutation,
  changeTheme: GraphqlChangeTheme
};

export { GraphQLUserMutations };
