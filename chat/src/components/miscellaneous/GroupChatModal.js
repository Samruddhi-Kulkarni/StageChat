import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import {
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,Box
} from "@chakra-ui/react";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from "../../Context/ChatProvider";
import { FormControl } from "@chakra-ui/react";
import axios from "axios";

const GroupChatModal = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSeacrh] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

    const handleSearch = async (query)=>{
            setSeacrh(query)
            if(!query)
            {
                return;
            }

            try{
                setloading(true);

                const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };

                  const {data} =await axios.get(`/api/user?seacrh=${search}`,config);
                setloading(false);
                setSearchResult(data);
            }catch(error){
                toast({
                    title: "Error Occured",
                    description: "Failed To Load the Seacrh results",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
            }
            
    };

    const handleSubmit =async ()=>
    {
            if(!groupChatName || !selectedUsers){
                toast({
                    title: "Please fill all fields",
                    description: "Failed To Load Chat",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                  return;
            }

            try{

                const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };

                  const {data} = await axios.post(`/api/chat/group`,{
                      name:groupChatName,
                      users:JSON.stringify(selectedUsers.map((u)=> u._id)),
                },config);

                setChats([data, ...chats]);
                onClose();
                toast({
                    title: "New Group Chat Created",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }catch(error){

                toast({
                    title: "Failed To Create Chat",
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
    };

    const handleGroup=(userToAdd)=>
    {
            if(selectedUsers.includes(userToAdd)){
                toast({
                    title: "User Already added",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                  return;
            }

            setSelectedUsers([...selectedUsers,userToAdd]);
    };

    const handleDelete =(delUser)=>
    {
            setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== delUser._id))
    };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            font="Work Sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Guest Sanvi"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w='100%' d='flex' flexWrap='wrap'>
             {selectedUsers.map((u)=>(
                 <UserBadgeItem key={u._id}
                 user={u}
                 handleFunction={()=>handleDelete(u)}
                 />
             ))}
             </Box>

            {loading ? (<div>loading...</div>) : (
               searchResult ?.slice(0,4).map((user)=> (
                   <UserListItem 
                   key={user._id} 
                   user={user}
                   handleFunction={()=> handleGroup(user)} />

               ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create chat
            </Button>
        
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
