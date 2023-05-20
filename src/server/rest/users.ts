import { userController } from "../controllers/user.controller";
import * as checkUtils from "../validation/user-validation";
import * as serverUtils from "../helpers/server-utils";
import * as userUtils from "../helpers/user-utils";
import { IncomingMessage, ServerResponse } from "http";
import { HOST, PORT, URLS } from "../constants";
import { METHOD } from "../types/server";

const getAllUsers = (_req: IncomingMessage, res: ServerResponse): void => {
  console.log("Get all users");
  const allUsers = userController.getAllUsers();
  const usersData = allUsers.map((user) => userUtils.getUserMainData(user));

  serverUtils.setAppJsonHeaders(res);
  res.statusCode = 200;
  res.end(JSON.stringify({ data: usersData }));
  console.log(`Users were successfully retrieved`);
  return;
};

const createUser = (req: IncomingMessage, res: ServerResponse): void => {
  console.log("Post new user");
  let body = "";

  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const newUser = JSON.parse(body).body;
    const users = userController.getAllUsers();

    if (checkUtils.isEmailExist(users, newUser)) {
      // Records conflict
      serverUtils.handleError(res, 409, `409: User with email: ${newUser.email} already exists`);
      return;
    }

    if (!checkUtils.isUserDataValid(newUser)) {
      // Bad request
      serverUtils.handleError(
        res,
        400,
        `400: Provided user data is not valid. Please check it and try again`
      );
      return;
    }

    const createdUser = userController.createUser(newUser);
    // Success write
    serverUtils.setAppJsonHeaders(res);
    res.statusCode = 201;
    res.end(JSON.stringify({ data: createdUser }));
    console.log(`User with id ${createdUser.id} user was successfully created`);
    return;
  });
};

const updateUser = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  const userId = Number(pathUserId);

  console.log("Patch existing user");
  let body = "";

  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const userUpdates = JSON.parse(body).body;
    const updatedUser = userController.updateUserById(userId, userUpdates);

    if (!updatedUser) {
      serverUtils.handleError(res, 404, `404: user with id ${userId} not found`);
      return;
    }

    serverUtils.setAppJsonHeaders(res);
    res.statusCode = 200;
    res.end(JSON.stringify({ data: updatedUser }));
    console.log(`User with id ${userId} was successfully updated`);
    return;
  });
};

const deleteUser = (_req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  console.log("Delete user");
  const userId = Number(pathUserId);

  const deletedUser = userController.deleteUser(userId);

  if (!deletedUser) {
    serverUtils.handleError(res, 404, `404: user with id ${userId} not found`);
    return;
  }
  // No content - no need to send back deleted user
  res.statusCode = 204;
  res.end();
  console.log(`User with id ${userId} was successfully deleted`);
  return;
};

const getUser = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  const userId = Number(pathUserId);

  console.log("Get user");
  const user = userController.getUserById(userId);

  if (!user) {
    serverUtils.handleError(res, 404, `404: user with id ${userId} not found`);
    return;
  }

  const userData = userUtils.getUserMainData(user);
  const hobbiesHATEOASlink = userUtils.generateHATEOASLink(
    "http",
    HOST,
    PORT.toString(),
    `/users/${user.id}/hobbies`
  );
  serverUtils.setAppJsonHeaders(res);
  res.statusCode = 200;
  res.end(JSON.stringify({ data: { ...userData, hobbiesLink: hobbiesHATEOASlink } }));
  console.log(`User with id ${userId} was successfully retrieved`);
  return;
};

const getHobby = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  const userId = Number(pathUserId);
  console.log("Get users hobbies list");

  const user = userController.getUserById(userId);

  if (!user) {
    serverUtils.handleError(res, 404, `404: user with id ${userId} not found`);
    return;
  }

  const userHobbies = userUtils.getUserHobbies(user);

  const expirationDate = new Date(Date.now() + 3600000).toUTCString();
  serverUtils.setAppJsonHeaders(res);
  // set cache for hobbies as they are not frequently mutating data
  serverUtils.setCacheHeader(res, expirationDate);
  res.statusCode = 200;
  res.end(JSON.stringify({ data: userHobbies }));
  console.log(`Hobbies for user with id ${userId} were successfully retrieved`);
  return;
};

const deleteUserHobby = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  const userId = Number(pathUserId);

  console.log("Delete hobby");
  let body = "";

  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const hobby = JSON.parse(body).body;

    if (!checkUtils.isHobbyValid(hobby)) {
      // Bad request
      serverUtils.handleError(
        res,
        400,
        `400: provided data for user with id ${userId} is not valid. Please check it and try again`
      );
      return;
    }

    const removedHobby = userController.deleteUserHobbyById(userId, hobby);

    if (!removedHobby) {
      serverUtils.handleError(
        res,
        404,
        `404: hobby ${hobby} for user with id ${userId} or user was not found`
      );
      return;
    }

    res.statusCode = 200;
    res.end();
    console.log(`Hobby ${hobby} for user with id ${userId} was successfully deleted`);
    return;
  });
};

const addNewHobby = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  const userId = Number(pathUserId);

  console.log("Post new hobby");
  let body = "";

  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    const hobby = JSON.parse(body).body;

    if (!checkUtils.isHobbyValid(hobby)) {
      // Bad request
      serverUtils.handleError(
        res,
        400,
        `400: provided data for user with id ${userId} is not valid. Please check it and try again`
      );
      return;
    }

    const updatedUser = userController.updateUserHobbyById(userId, hobby);

    if (!updatedUser) {
      serverUtils.handleError(res, 404, `404: user with id ${userId} not found`);
      return;
    }

    serverUtils.setAppJsonHeaders(res);
    res.statusCode = 200;
    res.end(JSON.stringify({ data: updatedUser }));
    console.log(`Hobbies for user with id ${userId} was successfully updated with hobby ${hobby}`);
    return;
  });
};

const handleUsers = (req: IncomingMessage, res: ServerResponse): void => {
  // Get all users
  if (serverUtils.isGet(req.method)) {
    getAllUsers(req, res);
  }
  // Create new user
  if (serverUtils.isPost(req.method)) {
    createUser(req, res);
  }
};

export const handleUser = (req: IncomingMessage, res: ServerResponse, pathUserId: string): void => {
  // Update some user fields by id
  if (serverUtils.isPatch(req.method)) {
    updateUser(req, res, pathUserId);
  }
  // Delete user by id
  if (serverUtils.isDelete(req.method)) {
    deleteUser(req, res, pathUserId);
  }
  // Get user by id
  if (serverUtils.isGet(req.method)) {
    getUser(req, res, pathUserId);
  }
};

export const handleUserHobby = (
  req: IncomingMessage,
  res: ServerResponse,
  pathUserId: string
): void => {
  // Add new hobby by id
  if (serverUtils.isPost(req.method)) {
    addNewHobby(req, res, pathUserId);
  }
  // Delete user hobby by id and hobby
  if (serverUtils.isPatch(req.method)) {
    deleteUserHobby(req, res, pathUserId);
  }
  // Get user hobbies list
  if (serverUtils.isGet(req.method)) {
    getHobby(req, res, pathUserId);
  }
};

export const restHandlers = {
  [URLS.users]: handleUsers,
  [URLS.usersWithId]: handleUser,
  [URLS.usersWithId + URLS.hobbies]: handleUserHobby,
};

// TODO should be improved to smth like that or methods as first layer and handlers under it depending on complexity of app
// export const restHandlers = {
//   [URLS.users]: {
//     [METHOD.GET]: ,
//     [METHOD.POST]: ,
//   },
//   [URLS.usersWithId]: {
//     [METHOD.GET]: ,
//     [METHOD.POST]: ,
//   },
//   [URLS.usersWithId + URLS.hobbies]: {
//     [METHOD.GET]: ,
//     [METHOD.POST]: ,
//   },
// };
// export const restHandlers = {
//     [METHOD.GET]: {
//       [URLS.users]: getUsers;
//       [URLS.usersWithId]: getUserById;
//       [URLS.usersWithId + URLS.hobbies]: getHobbiesByUserId;
//      },
//     [METHOD.POST]: {
//       [URLS.users]: createUsers;
//       [URLS.usersWithId]: updateUserById;
//       [URLS.usersWithId + URLS.hobbies]: addNewHobbyByUserId;
//      },
// ... other methods and their handlers
// };
