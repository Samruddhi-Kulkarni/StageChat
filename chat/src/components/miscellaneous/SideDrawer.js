import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { Box, effect, Spinner, Text, useToast} from "@chakra-ui/react";
import {Tooltip } from '@chakra-ui/tooltip';
import {Menu,MenuButton,MenuList,MenuItem,MenuDivider,} from "@chakra-ui/menu";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./Profile";
import { useNavigate } from "react-router-dom";
import {Drawer, DrawerBody,  DrawerHeader, DrawerOverlay,DrawerContent} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";


const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const[loadingChat,setLoadingChat]=useState(false);

  const navigate = useNavigate();
  const { user,setSelectedChat, chats,setChats , notification, setNotification} = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async  () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 8000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try{
      setLoading(true);
      const config={
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };

      const {data} = await axios.get(`/api/user?search=${search}`,
      config);

      setLoading(false);
      setSearchResult(data);
    }catch(error)
    {
      toast({
        title: "Error occured!",
        description:"failed to load search result",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat= async (userId) =>
  {
      try{
        setLoadingChat(true);
        const config={
          headers: {
            'Content-type':'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.post(`/api/chat`, {userId}, config);
        
        if(!chats.find((c)=> c._id === data._id)) setChats([data, ...chats]); 
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      }catch(error){
        toast({
          title: "Error Fetching the chats",
          description: error.message,
          status: "error",
          duration: 8000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </button>
        </Tooltip>

        <Text fontSize="2xl" color="red">
          Stage
        </Text>
        <Menu>
          <MenuButton p="1">
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem key={notif._id} onClick={()=> {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n  !== notif));
              }}>
              {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
            : `New Message from ${getSender(user,notif.chat.users)}`}</MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
                  <ChatLoading/>
            ): (
                   searchResult?.map((user)=>(
                     <UserListItem
                     key={user._id}
                     user={user}
                     handleFunction={()=>accessChat(user._id)}
                     />
                   ))
            )}

            {loadingChat && <Spinner ml='auto' d='flex'/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
