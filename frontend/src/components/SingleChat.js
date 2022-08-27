import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
// import "./styles.css";

import { ArrowRightIcon } from "@chakra-ui/icons";
import { Button, color, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const ENDPOINT = "http://localhost:3500"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    // console.log("what happend");
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("msg received", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        // do nothing
      } else {
        setMessages([...messages, newMsg]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const data = await fetch(
        `http://localhost:3500/api/msg/${selectedChat._id}`,
        config
      );

      const res = await data.json();

      console.log(res);
      setMessages(res);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (newMessage.length === 0) {
      return;
    }
    try {
      const config = {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },

        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat,
        }),
      };

      setNewMessage("");
      let data = await fetch(`http://localhost:3500/api/msg`, config);

      let res = await data.json();

      // console.log(res);
      socket.emit("new message", res);

      setMessages([...messages, res]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      console.log("connect");
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Box
              bg="black"
              p="4px 10px 10px 10px"
              m="0px"
              color="white"
              border="1px solid white"
              borderRadius="8px"
              boxShadow="1px 7px #414142 "
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                color="black"
              />

              {
                /* {messages && */
                !selectedChat.isGroup ? (
                  <span className="title">
                    {getSender(user, selectedChat.users)}

                    <span className="prof">
                      <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                      />
                    </span>
                  </span>
                ) : (
                  <span className="title">
                    {/* icon={<UserIcon />}? */}
                    {selectedChat.chatName.toUpperCase()}

                    <span className="prof2">
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </span>
                  </span>
                )
              }
            </Box>
          </Text>
          <Box
            p={3}
            paddingTop="5px"
            bg=""
            borderRadius="lg"
            overflowY="auto"
            className="msgbx"
            h="70vh"
            color="white"
          >
            {loading ? (
              <Spinner size="xl" w={7} h={7} alignSelf="center" m="0" />
            ) : (
              <div>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onSubmit={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      background: "black",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                className="inp"
                // mt="63vh"
                w="58%"
                position="fixed"
                bottom="20px"
                mt="5px"
                // boxSize="border-box"
                onChange={typingHandler}
                zIndex="2"
              />
              <Button
                onClick={sendMessage}
                position="fixed"
                bottom="20px"
                mt="5px"
                bg="#4d8ef7"
                ml="59%"
                _hover={{ color: "black", bg: "white" }}
                fontSize="xl"
                fontFamily="Work sans"
                zIndex="2"
              >
                send
                <ArrowRightIcon ml="15px" />
              </Button>
            </FormControl>
            <Box
              position="fixed"
              bottom="10px"
              mt="5px"
              bg="black"
              w="70.75%"
              h="60px"
              ml="-1%"
              border="1px solid white"
              borderRadius="8px"
              // zIndex="-1"
            ></Box>
          </Box>
        </>
      ) : (
        <Box margin="20% 0% 0% 13%" h="100%">
          <Text fontSize="5xl" pb={3} fontFamily="Work sans" color="silver">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
