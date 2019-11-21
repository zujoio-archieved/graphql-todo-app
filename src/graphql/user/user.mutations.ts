import {
  mutationWithClientMutationId,
  fromGlobalId,
  toGlobalId
} from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { iContext } from "../../serverConfig/context";

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

const GraphQLUserMutations = {
  register: GraphQLRegisterUserMutation,
  login: GraphQLLoginUserMutation
};

export { GraphQLUserMutations };
