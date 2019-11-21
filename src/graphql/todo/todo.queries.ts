import { GraphQLBoolean } from "graphql";
import { GraphqlTodoConnection } from "./todo.typeDef";
import { connectionArgs } from "graphql-relay";
import { iContext } from "../../serverConfig/context";

const GraphQLTodoQueries = {
  todos: {
    type: GraphqlTodoConnection,
    args: { ...connectionArgs, completed: { type: GraphQLBoolean } },
    resolve: async (info: any, args: any, ctx: iContext) => {
      const { userId }: any = await ctx.getUserId();
      return ctx._todoRepository.todosOfUser({ userId }, args);
    }
  }
};

export { GraphQLTodoQueries };
