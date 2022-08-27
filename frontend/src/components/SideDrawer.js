import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "./ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
// // import NotificationBadge from "react-notification-badge";
// // import { Effect } from "react-notification-badge";
// // import { getSender } from "../../config/ChatLogics";
import UserListItem from "./UserListItem";
import { ChatState } from "../Context/ChatProvider";
import { color } from "@chakra-ui/react";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    // notification,
    // setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (search === "") {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data = await fetch(
        `http://localhost:3500/api/user?search=${search}`,
        config
      );
      const res = await data.json();

      setLoading(false);
      setSearchResult(res);

      // console.log(res);
    } catch {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      };

      const data = await fetch(
        `http://localhost:3500/api/chat`,

        config
      );

      const res = await data.json();
      //  const { data } = await fetch(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === res._id)) setChats([res, ...chats]);
      setSelectedChat(res);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <>
      <Box
        d="flex"
        justifyItems="space-around"
        alignItems="center"
        bg="black"
        backgroundImage="black"
        mw="100%"
        p="5px 10px 5px 10px"
        borderWidth="0.5px"
        borderRadius="10px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" color="gray" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="3xl"
          fontFamily="Work sans"
          display="inline"
          color="
#f5f5f5

"
          marginLeft="30%"
          marginRight="31%"
        >
          Coder_T@lks
        </Text>
        <Menu>
          <MenuButton p={1}>
            {/* <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            /> */}
            <BellIcon fontSize="3xl" m={1} color="white" marginLeft="20%" />
          </MenuButton>
          {/* <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList> */}
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            bg="#4d8ef7"
            _hover={{ color: "black", bg: "white" }}
            color="white"
            // marginLeft="20%"
            rightIcon={<ChevronDownIcon />}
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList
            bg="#black"
            color="white"
            borderRadius="0"

            // _hover={{ bg: "blue.500", color: " white" }}
          >
            <ProfileModal user={user}>
              <MenuItem _hover={{ color: " black" }}>My Profile</MenuItem>{" "}
            </ProfileModal>
            <MenuDivider />
            <MenuItem _hover={{ color: " black" }} onClick={logoutHandler}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen} bg="black">
        <DrawerOverlay />
        <DrawerContent bg="black">
          <DrawerHeader borderBottomWidth="1px" color="white">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2} color="white">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              {/* <Button
                bg=""
                onClick={handleSearch}
                margin="5px"
                borderRadius="5px"
                border="1px solid white"
                _hover={{ color: "black", bg: "white " }}
              >
                Go
              </Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((users) => (
                <UserListItem
                  key={users._id}
                  user={users}
                  handleFunction={() => accessChat(users._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;

// import React from "react";

// const SideDrawer = () => {
//   return <div>SideDrawer</div>;
// };

// export default SideDrawer;
