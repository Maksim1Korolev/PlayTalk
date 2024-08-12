import asyncHandler from "express-async-handler";
import PlayerService from "../services/playerService.js";

// @desc   Get player by username
// @route  GET /players/:username
// @access Public
export const getPlayer = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const player = await PlayerService.getPlayer(username);

    if (!player) {
      return res.status(404).json({ message: "Player not found." });
    }

    return res.json({ player });
  } catch (error) {
    console.error("Error fetching player:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Get players by usernames
// @route  GET /players
// @access Public
export const getPlayers = asyncHandler(async (req, res) => {
  const usernames = req.query.usernames;

  if (!usernames || !Array.isArray(usernames)) {
    return res.status(400).json({ message: "Usernames array is required." });
  }

  try {
    const players = await PlayerService.getPlayers(usernames);

    return res.json({ players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// @desc   Update players' properties
// @route  PUT /players
// @access Public
export const updatePlayers = asyncHandler(async (req, res) => {
  const { player1NewData, player2NewData } = req.body;

  if (!player1NewData || !player2NewData) {
    return res
      .status(400)
      .json({ message: "Player data is required for both players." });
  }

  try {
    const updatedPlayers = await PlayerService.updatePlayers(
      player1NewData,
      player2NewData
    );

    return res.json({
      message: "Players updated successfully.",
      updatedPlayers,
    });
  } catch (error) {
    console.error("Error updating players:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// // @desc   Add a new player
// // @route  POST /players
// // @access Public
// export const addPlayer = asyncHandler(async (req, res) => {
//   const { username } = req.body;

//   if (!username) {
//     return res.status(400).json({ message: "Username is required." });
//   }

//   try {
//     const player = await PlayerService.addPlayer({ username, wins: 0 });

//     return res
//       .status(201)
//       .json({ message: "Player added successfully.", player });
//   } catch (error) {
//     console.error("Error adding player:", error);
//     return res.status(500).json({ message: "Internal server error.", error });
//   }
// });
