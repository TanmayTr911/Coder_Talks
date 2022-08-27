import React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Signup from "../auth/signup";
import Login from "../auth/login";

const Home = () => {
  const history = useHistory();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("userInfo"));

  //   if (user) history.push("/api/chats");
  // }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="#2B4EFF"
        // bg="#ed2849"
        justifyContent="center"
        p={2}
        borderRadius="md"
        m="3% 5% 0% 5%"
        w="100%"
      >
        <Text
          color="white"
          fontSize="3xl"
          justifyContent="center"
          p="0 0 0 34%"
          fontFamily="work sans"
        >
          Coder-Talks
        </Text>
      </Box>
      <Box
        // bg="#a88ff2"
        // bg="#8f72e8"
        bg="balck"
        justifyContent="center"
        p={2}
        borderRadius="md"
        border="2px solid white"
        m="2% 5% 0% 5%"
        w="100%"
      >
        <Tabs variant="enclosed" colorScheme="green">
          <TabList>
            <Tab
              color="white"
              borderRadius="hi"
              fontSize="xl"
              w="30%"
              _selected={{ color: "white", bg: "#2B4EFF" }}
            >
              Login
            </Tab>
            <Tab
              color="white"
              borderRadius="hi"
              fontSize="xl"
              w="30%"
              _selected={{ color: "white", bg: "#2B4EFF" }}
            >
              SignUp
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
