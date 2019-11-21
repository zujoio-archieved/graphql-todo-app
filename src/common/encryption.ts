import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const generateHash = (password: string) => {
  return bcrypt.hashSync(password, salt);
};

const compareHash = (hash: string, password: string) => {
  return bcrypt.compareSync(password, hash);
};

export { generateHash, compareHash };
