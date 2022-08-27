const asyncHandler = require("express-async-handler");
const Message = require("../models/msgmod");
const User = require("../models/usermod");
const Chat = require("../models/chatmod");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).send({ err: "Invalid request " });
  }

  let newMsg = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let msg = await Message.create(newMsg);

    msg = await msg.populate("sender", "name pic");
    msg = await msg.populate("chat");

    msg = await User.populate(msg, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastMsg: msg,
    });

    res.send(msg);
  } catch (err) {
    console.log(err);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const msg = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(msg);
  } catch (err) {
    res.status(400).send({ err: "err" });
  }
});

module.exports = { sendMessage, allMessages };
