import express from "express";
var router = express.Router();
import _ from "lodash";
import {
  updateCode,
  updateRoomLanguage,
  addNewChatMessage,
  getChatHistory,
  getRoomOrCreate,
} from "../controllers/database.js";

router.get("/runtimes", async (req, res) => {
  const runtimes = await client.runtimes();
  res.send(runtimes);
});

router.get(`/:roomId`, getRoomOrCreate);



export default router;
