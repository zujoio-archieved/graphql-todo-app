import { Todo } from "../../schema/todo/todo.model";
import { toObjectId, toBase64, fromBase64 } from "../../common/mongoose";
import _ from "lodash";
import { fromGlobalId, toGlobalId } from "graphql-relay";
import { GLOBAL_ID_TYPES } from "../../graphql/globalIdTypes";
import pubSub from "../../graphql/publisher";
import { TODO_SUBSCRIPTION_TRIGGERS } from "../../common/constants/subscriptions";

class TodoRepository {
  private static instance: TodoRepository;

  async todosOfUser(
    { userId }: { userId: any },
    {
      first,
      completed,
      after
    }: { first: number; completed: string; after: string }
  ) {
    console.log({
      first,
      completed,
      after
    });

    let where: any = { userId: toObjectId(userId) };
    if (after) {
      where["_id"] = { $lt: toObjectId(fromBase64(after)) };
    }

    if (typeof completed === "boolean") {
      where["completed"] = completed;
    }

    const todos = await Todo.find({ ...where })
      .sort({
        _id: -1
      })
      .limit(first);

    const firstEdge: any = _.head(todos);
    const lastEdge: any = _.last(todos);

    const [previousCount, nextCount] = await Promise.all([
      firstEdge ? Todo.count({ ...where, _id: { $gt: firstEdge._id } }) : 0,
      lastEdge ? Todo.count({ ...where, _id: { $lt: lastEdge._id } }) : 0
    ]);

    const edges = todos.map(todo => ({
      cursor: toBase64(`${todo._id}`),
      node: todo
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: nextCount > 0,
        hasPreviousPage: previousCount > 0,
        startCursor: firstEdge ? toBase64(`${firstEdge._id}`) : null,
        endCursor: lastEdge ? toBase64(`${lastEdge._id}`) : null
      }
    };
  }

  async createTodo({ title, userId }: { title: string; userId: string }) {
    const todo = new Todo({
      title,
      userId: toObjectId(userId),
      completed: false
    });

    await todo.save();

    const todoEdge = {
      cursor: toBase64(`${todo._id}`),
      node: todo
    };

    pubSub.publish(
      `${TODO_SUBSCRIPTION_TRIGGERS.TODO_CREATED}_${toGlobalId(
        GLOBAL_ID_TYPES.User,
        userId
      )}`,
      { todoEdge }
    );

    return {
      status: "SUCCESS",
      message: "Todo created successfully!",
      todoEdge
    };
  }

  async editTodo({
    todoId,
    userId,
    edits
  }: {
    todoId: string;
    userId: string;
    edits: object;
  }) {
    const todo = await Todo.findOneAndUpdate(
      { _id: toObjectId(todoId), userId: toObjectId(userId) },
      { ...edits },
      { new: true }
    );

    if (!todo) {
      return { status: "FAILED", message: "Todo not found!" };
    }

    const todoEdge = {
      cursor: toBase64(`${todo._id}`),
      node: todo
    };

    pubSub.publish(
      `${TODO_SUBSCRIPTION_TRIGGERS.TODO_EDITED}_${toGlobalId(
        GLOBAL_ID_TYPES.User,
        userId
      )}`,
      { todoEdge }
    );

    return {
      status: "SUCCESS",
      message: "Todo updated successfully!",
      todoEdge
    };
  }

  async deleteTodo(todoId: string, userId: string) {
    const del = await Todo.deleteOne({
      _id: toObjectId(todoId),
      userId: toObjectId(userId)
    });
    if (del.ok) {
      pubSub.publish(
        `${TODO_SUBSCRIPTION_TRIGGERS.TODO_DELETED}_${toGlobalId(
          GLOBAL_ID_TYPES.User,
          userId
        )}`,
        { deletedId: toGlobalId(GLOBAL_ID_TYPES.Todo, todoId) }
      );

      return { status: "SUCCESS", message: "Todo deleted successfully!" };
    } else {
      throw new Error("Unable to delete todo!");
    }
  }

  async deleteCompletedTodos(userId: string) {
    const todos = await Todo.find({
      userId: toObjectId(userId),
      completed: true
    });

    const ids = todos.map(todo =>
      toGlobalId(GLOBAL_ID_TYPES.Todo, `${todo._id}`)
    );

    const del = await Todo.deleteMany({
      userId: toObjectId(userId),
      completed: true
    });

    const { deletedCount }: any = del;

    if (deletedCount > 0) {
      pubSub.publish(
        `${TODO_SUBSCRIPTION_TRIGGERS.COMPLETED_TODOS_DELETED}_${toGlobalId(
          GLOBAL_ID_TYPES.User,
          userId
        )}`,
        { message: `deleted ${deletedCount} todos`, deletedIds: ids }
      );
    }
    return {
      status: "SUCCESS",
      message: `${deletedCount} todos deleted!`
    };
  }

  public static getInstance(): TodoRepository {
    if (!TodoRepository.instance) {
      TodoRepository.instance = new TodoRepository();
    }
    return TodoRepository.instance;
  }
}

export { TodoRepository };
