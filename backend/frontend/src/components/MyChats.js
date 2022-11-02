import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";

import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats, fet, setfet } =
    ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data = await fetch(`http://localhost:3500/api/chat`, config);
      const res = await data.json();

      console.log(res);
      setChats(res);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    console.log("helloooooo");
    fetchChats();
  }, [fet]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      // h="97%"
      w={{ md: "27%", base: "100%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg=""
      color="white"
      minH="85vh"
      // minH={{ base: "60vh", md: "85vh" }}
      // h={{ base: "40vh", md: "85vh" }}
      boxSize="border-box"
      // w="27%"
    >
      <GroupChatModal>
        <Button
          d="flex"
          h="6.5%"
          marginLeft="55%"
          marginTop="0px"
          p="8px"
          bg="#4d8ef7"
          c="white"
          fontSize="14px"
          // border="1px solid white"
          _hover={{ color: "black", bg: "white" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="fit-content"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="black"
        border="1px solid white"
        w="100%"
        margin="2px"
        marginLeft="0.2px"
        borderRadius="lg"
        h="65vh"
        overflowY="scroll"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#4d8ef7" : "#171717"}
                color={selectedChat === chat ? "white" : "white"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {/* {chat.isGroup === true ? setFetchAgain(!fetchAgain) : ""} */}
                  {/* {if(chat.isGroup)} */}
                  {/* {console.log(chat._id)} */}
                  {/* fetchAgain; */}
                  {/* {chat.isGroup === false ? console.log("hell") : fetchAgain} */}
                  {chat.isGroup === false
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
