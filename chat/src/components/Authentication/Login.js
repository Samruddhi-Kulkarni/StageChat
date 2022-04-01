import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const toast = useToast();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //----------An code--------------------
  // const loggedIn = () => {
  //    console.log(email,password);
  //   setLoading(true);
  // axios
  //     .post("http://localhost:5000/api/user/login", {
  //       email: email,
  //       password: password,
  //     })
  //     .then((res) => {
  //       console.log(email, password);
  //       // localStorage.setItem('userInfo',(data));
  //       setLoading(false);
  //       navigate('/chats')
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  //-------------------------------------------------------

  //============my code===============================

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Fill all details",
        status: "warning",
        duration: 8000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email,password);

    try {
      // setLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          //           Accept: "application/json"
        },
      };

      const { data } = await axios.post(
        "api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));

      toast({
        title: "Login successful",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing="2%">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={email}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          login
        </Button>

        <Button
          colorScheme="blue"
          width="100%"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </>
  );
};

export default Login;
