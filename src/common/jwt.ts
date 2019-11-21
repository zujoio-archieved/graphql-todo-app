import { Request } from "express";
import path from "path";
import fs from "fs";
import {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError,
  VerifyErrors,
  NotBeforeError
} from "jsonwebtoken";

class JWTRepository {
  private static instance: JWTRepository;
  private privateKEY: any;
  private publicKEY: any;
  private signOptions: any;
  private verifyOptions: any;

  constructor() {
    this.privateKEY = "abcd1234";
    //  fs.readFileSync(
    //   "../utils/keys/private.key",
    //   // path.join(__dirname, "./utils/private.key"),
    //   "utf8"
    // );
    this.publicKEY = "abcd1234";
    //  fs.readFileSync(
    //   "../utils/keys/public.key",
    //   // path.join(__dirname, "./utils/public.key"),
    //   "utf8"
    // );

    this.signOptions = {
      expiresIn: "12h"
      // algorithm: "RS256"
    };

    this.verifyOptions = {
      // issuer:  i,
      // subject:  s,
      // audience:  a,
      expiresIn: "12h"
      // algorithm: ["RS256"]
    };
  }

  generateToken(userId: string) {
    // const privateKey = "abcd1234";

    var token = sign(
      { userId },
      this.privateKEY,
      //fs.readFileSync("../../utils/private.key", "utf8"),
      this.signOptions
    );
    return token;
  }

  async verfyToken(token: string) {
    const { userId } = await new Promise((resolve, reject) => {
      verify(
        token,
        this.publicKEY,
        // fs.readFileSync("../../utils/public.key", "utf8"),
        this.verifyOptions,
        (err, data: any) => {
          if (err) {
            // if (err instanceof TokenExpiredError) {
            // } else if (err instanceof JsonWebTokenError) {
            // } else if (err instanceof NotBeforeError) {
            // } else {
            // }
            throw err;
          } else {
            resolve({ userId: data.userId });
          }
        }
      );
    });
    return { userId };
  }

  // getUserId(token:string) {
  //   this.verfyToken(token)
  // }

  public static getInstance(): JWTRepository {
    if (!JWTRepository.instance) {
      JWTRepository.instance = new JWTRepository();
    }

    return JWTRepository.instance;
  }
}

export { JWTRepository };
