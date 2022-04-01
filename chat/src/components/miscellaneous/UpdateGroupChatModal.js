import React, { useState } from 'react'
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { IconButton } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';



    const UpdateGroupChatModal=({fetchAgain,setFetchAgain,fetchMessages})=>{

        const { isOpen, onOpen, onClose } = useDisclosure();
        const {user, setSelectedChat , selectedChat}= ChatState();
        const [groupChatName,setGroupChatName]=useState();
        const[loading,setLoading]=useState(false);
        const[search,setSearch]=useState("");
        const [searchResult,setSearchResult]=useState([]);
        const[renameLoading,setRenameLoading]=useState(false);

        const toast=useToast();

        const handleAddUser=async(user1)=>{
               if(selectedChat.users.find((u) => u._id === user1._id) ){
                toast({
                    title: "User already in group",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  return;
               }

              if(selectedChat.groupAdmin._id !== user._id){
                toast({
                    title: "Only admins can add someone",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
                  return;
              }

              try {
                  setLoading(true);

                  const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };

                  const {data}=await axios.put(`/api/chat/groupadd`,{
                    chatId:selectedChat._id,
                    userId: user1._id
                  },config);

                  setSelectedChat(data);
                  setFetchAgain(!fetchAgain);
                  setLoading(false);
              } catch (error) {
                toast({
                    title: "Error Occured",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  setLoading(false);
              }
              setGroupChatName("");
        };
        
        const handleRemove=async(user1)=>{
            if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
                toast({
                    title: "Only admins can remove someone",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  return;
              }

              try {
                setLoading(true);

                const config = {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                };

                const {data}=await axios.put(`/api/chat/groupremove`,{
                  chatId:selectedChat._id,
                  userId: user1._id
                },config);

                user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                fetchMessages();
                setLoading(false);
              } catch (error) {
                toast({
                    title: "Only admins can remove someone",
                    description:error.respone.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  return;
              }
        };

        const handleRename=async ()=>{

            if(!groupChatName)
            {return;}
            try {
                setRenameLoading(true);

                const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };

                  const {data}= await axios.put(`/api/chat/rename`,
                  {
                      chatId:selectedChat._id,
                      chatName: groupChatName,
                  },config);

                  setSelectedChat(data);
                  setFetchAgain(!fetchAgain);
                  setRenameLoading(false);
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description:error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
                  setRenameLoading(false);
            }
        
                setGroupChatName("");
        };

        const handleSearch=async(query)=>{
            setSearch(query);
            if(!query){
                return;
            }

            try{
                setLoading(true);
                const config={
                    headers:{
                        Authorization:`Bearer ${user.token}`,
                    },
                };

                const {data} = await axios.get(`/api/user?search=${search}`,config);
                setLoading(false)
                setSearchResult(data);
            }
            catch(error){
                toast({
                    title: "Error Occured",
                    description: "Failed To Load Search Results",
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                    position: "bottom-left",
                  }); 
                  setLoading(false); 
            }
        };

      

  return (
    <>
    <IconButton  d={{base:'flex'}} icon={<ViewIcon/>}  onClick={onOpen} />

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{selectedChat.chatName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
            <Box w='100%' d='flex' flexWrap='wrap' pb={3}>
                {selectedChat.users.map((u)=>(
                    <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={()=>handleRemove(u)}/>
                ))}
            </Box>

            <FormControl d='flex'>
            <Input 
            placeholder='Chat Name'
            mb={3}
            value={groupChatName}
            onChange={(e)=> setGroupChatName(e.target.value)}
            />
            <Button
            variant='solid'
            colorScheme='teal'
            ml={1}
            isLoading={renameLoading}
            onClick={handleRename}
            > Update
            </Button>
            </FormControl>

            <FormControl>
            <Input  placeholder='Add userTo Group'
            mb={1} 
            onChange={(e)=> handleSearch(e.target.value)} />
            </FormControl>

            {
        loading ? (
            <Spinner size='lg' />
        ) : (
            searchResult?.map((user) => (
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}/>
            ))
        )                
            }
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='red'  onClick={()=> handleRemove(user)}>
         Leave Group
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    </>
  )
};
export default UpdateGroupChatModal;