import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <>
      <h1>home page</h1>
      <Container maxW="XL" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          padding={3}
          background="white"
          w="50%"
          h="100%"
          m="80px 0 15px 0"
          borderRadius="1g"
          borderWidth="1px"
        >
          <Text fontSize="4xl" color="red">
            Stage
          </Text>
        </Box>

        <Box
          background="white"
          w="50%"
          h="100%"
          padding={4}
          borderRadius="1g"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab width="50%">Sign Up</Tab>
              <Tab width="50%">Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Signup />
              </TabPanel>
              <TabPanel>
                <Login />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
