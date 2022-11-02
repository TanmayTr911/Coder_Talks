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

const Signup = () => {
  const toast = useToast();
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [pic, setPic] = useState("");
  const handleClick = () => setShow(!show);
  const history = useHistory();
  // const navi = useNavigate();

  const postPic = (pic) => {
    setLoad(true);

    if (pic === undefined) {
      toast({
        title: "Upload Image",
        description: "Please upload a valid image for Profile",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }
    console.log(pic);
    if (pic.type === "image/jpeg" || pic.type === "iamge/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat app");
      data.append("cloud_name", "dzkli6tdy");
      fetch("https://api.cloudinary.com/v1_1/dzkli6tdy/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoad(true);
    if (!name || !email || !pass || !cpass) {
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
    if (pass !== cpass) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }

    try {
      let result = await fetch("http://localhost:3500/api/user", {
        method: "post",
        body: JSON.stringify({ name, email, pass, pic }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.log(result);
      if (result.err === "User Exist") {
        toast({
          title: "User Already Exist!",
          description: "Please Login",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoad(false);
        // history.push("api/user/login");
        return;
      }

      toast({
        title: "Registration Success!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);

      localStorage.setItem("userInfo", result);
      if (result) {
        history.push("/chats");
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoad(false);
      return;
    }
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel color="white" margin="0">
          Name
        </FormLabel>
        <Input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          background="white"
          marginBottom="2"
          placeholder="Enter Name"
          _placeholder={{ opacity: 0.5, color: "blue" }}
        ></Input>
        <FormLabel color="white" margin="0">
          Email
        </FormLabel>
        <Input
          id="email"
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
            id="pass"
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
              size="md"
              onClick={handleClick}
              background="#b3d8f5"
              marginTop="8px"
              marginRight="8px"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel color="white" margin="0">
          Confirm Password{" "}
        </FormLabel>
        <InputGroup size="md">
          <Input
            id="cpass"
            onChange={(e) => setCpass(e.target.value)}
            value={cpass}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            _placeholder={{ opacity: 0.5, color: "blue" }}
            background="white"
            margin="3px"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="md"
              onClick={handleClick}
              background="#b3d8f5"
              marginTop="8px"
              marginRight="8px"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel color="white" margin="0">
          {" "}
          Upload Profile{" "}
        </FormLabel>
        <Input
          onChange={(e) => postPic(e.target.files[0])}
          marginBottom="2"
          color="white"
          type="file"
          border="0"
          margin="3px"
        ></Input>

        <Button
          _hover={{ color: "#2B4EFF", background: "white" }}
          marginLeft="30%"
          w="40%"
          color="white"
          background="#2B4EFF"
          onClick={submitHandler}
          isLoading={load}
        >
          {" "}
          SignUp
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Signup;
