import express from "express";
import { matchedData, query, validationResult, checkSchema } from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
import usersRouter from "./routes/users.mjs"; 

const app = express();

app.use(express.json());

app.use(usersRouter);

const loggingMiddleware = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

const resolveUserIndexById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};

// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "jason", displayName: "jason" },
  { id: 2, username: "brad", displayName: "b-dog" },
  { id: 3, username: "charley", displayName: "chucky" },
  { id: 4, username: "delphine", displayName: "daphney" },
  { id: 5, username: "edward", displayName: "scissora" },
  { id: 6, username: "franklin", displayName: "danklin" },
];

app.listen(PORT, () => {
  console.log(`Running on port  ${PORT}`);
});

//get
app.get("/", (req, res, next) => {
  console.log("Base URL");
  next();
  (req, res, next) => {
    res.status(202).send({ msg: "Hello" });
  };
});

//localhost:3000/api/users?filter=username
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3 and 10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    return res.send(mockUsers);
  }
);

http: app.get("/api/users", (req, res) => {
  console.log(req.query);
  const {
    query: { filter, value },
  } = req;
  //when filter and value are undefined
  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.send(mockUsers);
});

//get
app.get("/api/users/:id", resolveUserIndexById, (req, res) => {
  console.log(req.params);
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

// post
app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  return res.sendStatus(201).send(newUser);
});

// put - updates the entire request body
app.put("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(204);
});

//patch - updates part of  the request body

app.patch("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(204);
});

//delete - deletes.

app.delete("/api/users/:id", resolveUserIndexById, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(204);
});
