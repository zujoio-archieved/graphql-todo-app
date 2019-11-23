import { GraphQLString, GraphQLObjectType } from "graphql";
import { ThemeType } from "./user.typeDef";
import pubSub from "../publisher";
import { USER_SUBSCRIPTION_TRIGGERS } from "../../common/constants/subscriptions";

const GraphqlUserSubscription = {
  themeChanged: {
    args: { viewerId: { type: GraphQLString } },
    type: new GraphQLObjectType({
      name: "themeChanged",
      fields: () => ({
        theme: { type: ThemeType }
      })
    }),
    resolve: (info: any) => info,
    subscribe: (info: any, { viewerId }: any) => {
      return pubSub.asyncIterator(
        `${USER_SUBSCRIPTION_TRIGGERS.USER_CHANGED_THEME}_${viewerId}`
      );
    }
  }
};

export { GraphqlUserSubscription };
