import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    admin: true,
  },
  {
    name: "Matan Neyman",
    email: "matan@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Dor Cohen",
    email: "dor@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
