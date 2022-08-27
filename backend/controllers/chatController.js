const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatmod");
const User = require("../models/usermod");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("no id sent");
    return res.status(400);
  }

  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-pass")
    .populate("lastMsg");

  isChat = await User.populate(isChat, {
    path: "lastMsg.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroup: false,
      users: [userId, req.user._id],
    };
    try {
      const createChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-pass"
      );
      res.status(200).send(FullChat);
    } catch (err) {
      res.status(400).sned(err);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    var result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-pass")
      .populate("groupAdmin", "-pass")
      .populate("lastMsg")
      .sort({ updatedAt: -1 });

    result = await User.populate(result, {
      path: "lastMsg.sender",
      select: "name pic email",
    });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  console.log(req.body.users);

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ msg: "enter all details" });
  }

  var u = JSON.parse(req.body.users);

  if (u.length < 2) {
    return res.status(400).send({ msg: ">2 users" });
  }

  u.push(req.user);

  try {
    const groupchat = await Chat.create({
      chatName: req.body.name,
      users: u,
      isGroup: true,
      groupAdmin: req.user,
    });

    const FullGroupChat = await Chat.findOne({ _id: groupchat._id })
      .populate("users", "-pass")
      .populate("groupAdmin", "-pass");

    res.status(200).send({ FullGroupChat });
  } catch (err) {
    res.status(400).send({ err: "err in grp chat" });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-pass")
    .populate("groupAdmin", "-pass");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  var x = await Chat.findById(chatId);

  var y = x.users;

  for (var i = 0; i < y.length; i++) {
    if (y[i] == userId) {
      return res.status(400).send("user already there");
    }
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  var x = await Chat.findById(chatId);

  var y = x.groupAdmin._id;

  // console.log(y);
  // console.log(==y);

  if (y.toString() !== req.user._id.toString()) {
    // console.log(y);
    // console.log(req.user._id);
    return res.status(400).send("only adm");
  }

  const rem = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!rem) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(rem);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
