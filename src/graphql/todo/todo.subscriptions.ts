import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { TodoEdgeType } from "./todo.typeDef";
import pubSub from "../publisher";
import { TODO_SUBSCRIPTION_TRIGGERS } from "../../common/constants/subscriptions";

const GraphQLTodoSubscription = {
  todoCreated: {
    args: { viewerId: { type: GraphQLString } },
    type: new GraphQLObjectType({
      name: "todoCreated",
      fields: () => ({
        todoEdge: { type: TodoEdgeType }
      })
    }),
    resolve: (info: any) => info,
    subscribe: (info: any, { viewerId }: any) => {
      return pubSub.asyncIterator(
        `${TODO_SUBSCRIPTION_TRIGGERS.TODO_CREATED}_${viewerId}`
      );
    }
  },
  todoEdited: {
    args: { viewerId: { type: GraphQLString } },
    type: new GraphQLObjectType({
      name: "todoEdited",
      fields: () => ({
        todoEdge: { type: TodoEdgeType }
      })
    }),
    resolve: (info: any) => info,
    subscribe: (info: any, { viewerId }: any) => {
      return pubSub.asyncIterator(
        `${TODO_SUBSCRIPTION_TRIGGERS.TODO_EDITED}_${viewerId}`
      );
    }
  },
  todoDeleted: {
    args: { viewerId: { type: GraphQLString } },
    type: new GraphQLObjectType({
      name: "todoDeleted",
      fields: { deletedId: { type: GraphQLString } }
    }),
    resolve: (info: any) => info,
    subscribe: (info: any, { viewerId }: any) => {
      return pubSub.asyncIterator(
        `${TODO_SUBSCRIPTION_TRIGGERS.TODO_DELETED}_${viewerId}`
      );
    }
  },
  completedTodosDeleted: {
    args: { viewerId: { type: GraphQLString } },
    type: new GraphQLObjectType({
      name: "completedTodosDeleted",
      fields: () => ({
        message: { type: GraphQLString },
        deletedIds: { type: new GraphQLList(GraphQLString) }
      })
    }),
    resolve: (info: any) => info,
    subscribe: (info: any, { viewerId }: any) => {
      return pubSub.asyncIterator(
        `${TODO_SUBSCRIPTION_TRIGGERS.COMPLETED_TODOS_DELETED}_${viewerId}`
      );
    }
  }
};

export { GraphQLTodoSubscription };
