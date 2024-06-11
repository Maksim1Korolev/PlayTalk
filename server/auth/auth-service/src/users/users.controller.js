import asyncHandler from "express-async-handler";
import axios from "axios";

const repositoryServiceUrl = `${process.env.AUTH_REPOSITORY_SERVICE_URL}/users`;

// @desc   Get users
// @route  GET /api/users/
// @access Protected
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(repositoryServiceUrl);
    res.json({ users: response.data.users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Add a user
// @route  POST /api/users
// @access Public
export const addUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const response = await axios.post(repositoryServiceUrl, { user });
    res
      .status(201)
      .json({ user: response.data.user, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Delete a user
// @route  DELETE /api/users/:id
// @access Public
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const url = `${repositoryServiceUrl}/${id}`;
    const response = await axios.delete(url);
    res
      .status(200)
      .json({ user: response.data.user, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Get user by username
// @route  GET /api/users/username/:username
// @access Protected
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `${repositoryServiceUrl}/username/${username}`
    );
    res.json({ user: response.data.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Get user by ID
// @route  GET /api/users/id/:id
// @access Protected
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${repositoryServiceUrl}/id/${id}`);
    res.json({ user: response.data.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc   Update a user
// @route  PUT /api/users/:id
// @access Protected
export const updateUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const url = `${repositoryServiceUrl}/${user._id}`;
    const response = await axios.put(url, user);
    res.json({ user: response.data.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
