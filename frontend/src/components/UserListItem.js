import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../Context/ChatProvider";

const UserListItem = ({ handleFunction, user }) => {
  //   const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      _hover={{
        background: "#4d8ef7",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="white"
      px={3}
      py={2}
      mb={2}
      bg="#171717"
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
