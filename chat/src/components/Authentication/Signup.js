import React, {useState} from 'react';
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const toast = useToast();
  const navigate= useNavigate();
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmPassword,setConfirmPassword]=useState();
    const [loading, setLoading]= useState(false);
    const submitHandler= async ()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword)
      {
        toast({
          title: 'Fill all details',
          status: 'warning',
          duration: 8000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
        return;
      }

      if(password !== confirmPassword){
        toast({
          title: 'Password and confirm password doesnt match',
          status: 'warning',
          duration: 8000,
          isClosable: true,
          position:'bottom',
        });
        return;
      }

        try{
            const config={
              headers: {
                "Content-type":"application/json",
              },
            };
            const {data}= await axios.post('/api/user/',{name,email,password},
            config
            );
            toast({
              title: 'Registration successful',
              status: 'success',
              duration: 8000,
              isClosable: true,
              position:'bottom',
            });
           
            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
           navigate('/chats');
        }
        catch(error){
          toast({
            title: 'Error occured',
            description:error.response.data.message,
            status: 'success',
            duration: 8000,
            isClosable: true,
            position:'bottom',
          });
         setLoading(false);
        }
    };
  return (
    <>
    <VStack spacing='2%' >
      <FormControl id='name' isRequired >
         <FormLabel>
         Name
        </FormLabel>
        <Input 
        value={name}
        placeholder='Enter Name'
        onChange={(e)=>setName(e.target.value)}/>
      </FormControl>
      <FormControl id='email' isRequired>
         <FormLabel>
        Email
        </FormLabel>
        <Input 
        value={email}
        placeholder='Enter Email' 
        onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>
      <FormControl id='password' isRequired>
         <FormLabel>
        Password
        </FormLabel>
        <Input 
        value={password}
        placeholder='Enter Password'
        onChange={(e)=>setPassword(e.target.value)}/>
      </FormControl>
      <FormControl id='confirm password' isRequired>
         <FormLabel>
        Confirm password
        </FormLabel>
        <Input 
        value={confirmPassword}
        placeholder='Enter Confirm password'
        onChange={(e)=>setConfirmPassword(e.target.value)}/>
      </FormControl>

      <Button colorScheme='red'
      variant='solid'
      width='30%'
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}>sign up</Button>

      
    </VStack>
  </>
  )
}

export default Signup;