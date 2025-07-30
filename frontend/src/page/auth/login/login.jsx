import React  from 'react'
import  "./login.css"
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, Navigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react"
import toast from 'react-hot-toast';



function login() {
  const query=useQueryClient()
   const [logininput,setinput]=useState({
    email:"",
    password:"",
   })
const {mutate:login,isPending,error}=useMutation({
  mutationFn:async (val) => {
    const res=await fetch("http://localhost:5000/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      
      },
      body:JSON.stringify(val),
      credentials:"include"
    })
    const data=await res.json();
    if(!res.ok) throw new Error(data.error || "something is wrong");
    return data;
  },
  onSuccess:()=>{
   
    toast.success("succesfully login")
       query.invalidateQueries({queryKey:["auth"]})
  },
  onError:()=>{
   toast.error("faild to login")
  }
})
  const [visble,setVisible]=useState(false)
   function Login(e){
    const {name,value}=e.target;
    setinput((prev)=>{
       return{
         ...prev,
         [name]:value.trimStart(),
       }
    })
   }
   function logiform(e){
        e.preventDefault()
        login(logininput)
       
   }
   function Visible(){
setVisible(!visble);
if(visble){

}
   }
  return (
    <div className='login-container'>
      <div className="login-icon">
        <XIcon className='icon'/>
      </div>
      <div className="loginform">
        <h1>Let's go.</h1>
        <form >
          
          <div> 
              <MailOutlineIcon className='icons'/>
             <input type="text" name="email" placeholder='Email' value={logininput.email} onChange={Login}/>
          </div>
          <div>
          <PasswordIcon className='icons'/>
            <input type={!visble ? "password" : "text"} name="password"   placeholder='Password' value={logininput.password} onChange={Login} />
            <VisibilityIcon className='visibility'onClick={Visible}/>
            </div>
            {error && <div style={{color:"red"}}>{error.message}</div>}
         <button onClick={logiform}>{isPending ? "Loading.." :"Sign in"}</button>
        </form>
       <p className='account'> Don't have an account?</p>
    <Link to={"/signup"}>  <button>Sign up</button></Link>

      </div>
    </div>
  )
}

export default login
