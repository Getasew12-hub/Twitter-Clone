import React  from 'react'
import  "./signup.css"
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react"
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


function Signup() {
  const query=useQueryClient();
   const [logininput,setinput]=useState({
    email:"",
    username:"",
    fullname:"",
    password:"",
   })

  const {mutate:signup,isPending,error}=useMutation({
  mutationFn:async (val) => {
    const res=await fetch("http://localhost:5000/auth/signup",{
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
      query.invalidateQueries({queryKey:["auth"]})
     toast.success("succesfully signup")
  },
  onError:()=>{
   toast.error("faild to signup")
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
        signup(logininput)
        console.log(logininput);
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
        <h1>Join today.</h1>
        <form >
          
          <div> 
              <MailOutlineIcon className='icons'/>
             <input type="text" name="email" placeholder='Email' value={logininput.email} onChange={Login}/>
          </div>
          <div> 
              <PersonIcon className='icons'/>
             <input type="text" name="username" placeholder='Usernanme' value={logininput.username} onChange={Login}/>
          </div>
          <div> 
              <DriveFileRenameOutlineIcon className='icons'/>
             <input type="text" name="fullname" placeholder='Fullname' value={logininput.fullname} onChange={Login}/>
          </div>
          
          <div>
          <PasswordIcon className='icons'/>
            <input type={!visble ? "password" : "text"} name="password"   placeholder='Password' value={logininput.password} onChange={Login} />
            <VisibilityIcon className='visibility'onClick={Visible}/>
            </div>
            {error && <div style={{color:"red"}}>{error.message}</div>}
         <button onClick={logiform}>{isPending ? "Loading.." :"Sign up"}</button>
        </form>
       <p className='account'> Don't have an account?</p>
    <Link to={"/login"}>  <button>Sign in</button></Link>

      </div>
    </div>
  )
}

export default Signup;
