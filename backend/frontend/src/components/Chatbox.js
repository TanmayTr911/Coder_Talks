import React from "react";
import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = (fetchAgain, setFetchAgain) => {
  // const { selectedChat } = ChatState();
  return (
    <Box
      alignItems="center"
      flexDir="column"
      bgImage=" linear-gradient(to right,#17151f,#040621, #17151f)"
      w={{ base: "100%", md: "72%" }}
      minH="85vh"
      h="100%"
      borderRadius="lg"
      border="1px solid white"
      marginLeft={{ base: "0%", md: "28%" }}
      marginTop={{ md: "-38.5%", base: "0%" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
