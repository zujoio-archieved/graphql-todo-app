import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from "graphql";
import { toGlobalId } from "graphql-relay";
import { GLOBAL_ID_TYPES } from "../globalIdTypes";
import { GraphQLTodoQueries } from "../todo/todo.queries";

export const ThemeType = new GraphQLObjectType({
  name: "userTheme",
  fields: () => ({
    index: { type: GraphQLInt },
    name: { type: GraphQLString },
    primary: { type: GraphQLString },
    dark: { type: GraphQLString },
    light: { type: GraphQLString }
  })
});

const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: ({ _id, id }) => {
        return toGlobalId(GLOBAL_ID_TYPES.User, id ? id : _id);
      }
    },
    theme: {
      type: ThemeType
    },
    availableThemes: {
      type: new GraphQLList(ThemeType)
    },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    todos: GraphQLTodoQueries.todos
  })
});

export default GraphQLUser;
