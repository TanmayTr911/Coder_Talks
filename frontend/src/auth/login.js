import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  VStack,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

const Login = () => {
  const toast = useToast();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [load, setLoad] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    setLoad(true);
    if (!email || !pass) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }

    try {
      let result = await fetch("http://localhost:3500/api/user/login", {
        method: "post",
        body: JSON.stringify({ email, pass }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();

      if (result.err === "Wrong PAss") {
        toast({
          title: "Incorrect Password!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoad(false);
        return;
      }

      toast({
        title: "Login SuccessFull!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      localStorage.setItem("userInfo", JSON.stringify(result));
      // console.log(result._id);
      if (result) {
        history.push("/api/chats");
      }
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
    }
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel color="white" margin="0">
          Email
        </FormLabel>
        <Input
          id="lemail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          background="white"
          marginBottom="2"
          placeholder="Enter Email"
          _placeholder={{ opacity: 0.5, color: "blue" }}
        ></Input>
        <FormLabel color="white" margin="0">
          Password{" "}
        </FormLabel>
        <InputGroup size="md">
          <Input
            id="lpass"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            _placeholder={{ opacity: 0.5, color: "blue" }}
            background="white"
            margin="3px"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              background="#b3d8f5"
              marginTop="8px"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button
          marginLeft="35%"
          w="30%"
          color="white"
          background="#2B4EFF"
          marginTop="15px"
          _hover={{ color: "#2B4EFF", background: "white" }}
          onClick={submitHandler}
          isLoading={load}
        >
          {" "}
          Login
        </Button>
        <Button
          background="#2B4EFF"
          marginLeft="35%"
          w="30%"
          color="white"
          marginTop="15px"
          _hover={{ color: "#2B4EFF", background: "white" }}
        >
          {" "}
          Guest User
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Login;
