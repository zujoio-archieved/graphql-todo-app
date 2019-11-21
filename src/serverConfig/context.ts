import { Request, Response, response } from "express";
import { JWTRepository } from "../common/jwt";
import { UserRepository } from "../repository/user/user.repository";
import { TodoRepository } from "../repository/todo/todo.repository";

interface iContext {
  getUserId(): Promise<{ userId: string } | Error>;
  _userRepository: UserRepository;
  _todoRepository: TodoRepository;
}

class ContextRepository {
  private static instance: ContextRepository;
  private request: Request;
  private response: Response;
  public _userRepository: UserRepository; // = UserRepository.getInstance();
  public _todoRepository: TodoRepository; // = TodoRepository.getInstance();
  public _JWTRepository: JWTRepository; // = JWTRepository.getInstance();

  constructor({ request, response }: { request: Request; response: Response }) {
    this.request = request;
    this.response = response;
    this._userRepository = UserRepository.getInstance();
    this._todoRepository = TodoRepository.getInstance();
    this._JWTRepository = JWTRepository.getInstance();
  }

  async getUserId() {
    const authorization = this.request.headers.authorization;
    if (!authorization) {
      throw new Error("No authorization headers found");
    }
    const token = authorization.replace("Bearer ", "");
    const { userId } = await this._JWTRepository.verfyToken(token);
    return { userId };
  }

  public static getInstance({
    request,
    response
  }: {
    request: Request;
    response: Response;
  }): ContextRepository {
    if (!ContextRepository.instance) {
      ContextRepository.instance = new ContextRepository({ request, response });
    }

    return ContextRepository.instance;
  }
}

export { ContextRepository, iContext };
