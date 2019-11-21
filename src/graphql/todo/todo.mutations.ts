import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLString, GraphQLBoolean, GraphQLList, GraphQLID } from "graphql";
import { iContext } from "../../serverConfig/context";
import { GraphqlTodo, TodoEdgeType } from "./todo.typeDef";

const GraphQLCreateTodoMutation = mutationWithClientMutationId({
  name: "createTodo",
  inputFields: {
    title: { type: GraphQLString }
  },
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    todoEdge: { type: TodoEdgeType }
  },
  mutateAndGetPayload: async ({ title }, ctx: iContext) => {
    const { userId }: any = await ctx.getUserId();
    return await ctx._todoRepository.createTodo({ title, userId });
  }
});

const GraphQLEditTodoMutation = mutationWithClientMutationId({
  name: "editTodo",
  inputFields: {
    id: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    title: { type: GraphQLString }
  },
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  },
  mutateAndGetPayload: async ({ id, completed, title }, ctx: iContext) => {
    const { userId }: any = await ctx.getUserId();
    const cedit = typeof completed === "boolean" ? { completed } : {};
    const tedit = title ? { title } : {};
    return await ctx._todoRepository.editTodo({
      todoId: fromGlobalId(id).id,
      userId,
      edits: { ...cedit, ...tedit }
    });
  }
});

const GraphQLDeleteCompletedTodosMutation = mutationWithClientMutationId({
  name: "deleteCompletedTodos",
  inputFields: {},
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  },
  mutateAndGetPayload: async ({}, ctx: iContext) => {
    const { userId }: any = await ctx.getUserId();

    return await ctx._todoRepository.deleteCompletedTodos(userId);
  }
});

const GraphQLDeleteTodoMutation = mutationWithClientMutationId({
  name: "deleteTodo",
  inputFields: { id: { type: GraphQLID } },
  outputFields: {
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  },
  mutateAndGetPayload: async ({ id }, ctx: iContext) => {
    const { userId }: any = await ctx.getUserId();

    return await ctx._todoRepository.deleteTodo(fromGlobalId(id).id, userId);
  }
});

const GraphQLTodoMutations = {
  createTodo: GraphQLCreateTodoMutation,
  editTodo: GraphQLEditTodoMutation,
  deleteCompletedTodos: GraphQLDeleteCompletedTodosMutation,
  deleteTodo: GraphQLDeleteTodoMutation
};

export { GraphQLTodoMutations };
