import React, { useState } from 'react'
import "./edit.css"
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryFn } from '../../controller/queryFn/queryFn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRef } from 'react';
function edit({user}) {
  const query=useQueryClient()
  const oldPassword=useRef()
  const newPassword=useRef()
const [olapasswordVisible,setold]=useState(true)
const [newpasswordVisible,setnew]=useState(true)
  const [UpdateProfile,setProfile]=useState({
    fullname:user.fullname || "",
    username:user.username || "",
    email:user.email || "",
    bio:user.bio || "",
    link:user.link || '',
    currentpassword:"",
    newpassword:"",
  })

  const { mutate: Updateprofile, isPending: LoadUpdate ,isError,error} = useMutation({
    mutationFn: async (val) => {
      const res = await fetch("https://twitter-clone-ckda.onrender.com/user/editprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(val),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "someting is wrong");
      return data;
    },
    onSuccess: (data) => {
     
      toast.success("success");

  
  
  query.setQueryData(["profile"],(old)=>{
  
    return { ...old,
          fullname:UpdateProfile.fullname || old.fullname,
    username:UpdateProfile.username || old.username,
    email:UpdateProfile.email || old.email,
    bio:UpdateProfile.bio || old.bio,
    link:UpdateProfile.link || old.link,
 
    }
  });
oldPassword.current.value="";
newPassword.current.value="";
setold(true);
setnew(true);
       document.querySelector(".edit-container").style.visibility="hidden"
   
    },
    onError: (err) => {
      console.log(err);
      toast.error("faid to update ");
    },
  });

  function Clear(){
    document.querySelector(".edit-container").style.visibility="hidden"
  }
  function EditProfile(e){
    const {name,value}=e.target;
  setProfile((prev)=>{
        return {
          ...prev,
          [name]:value.trimStart(),
        }
  })
  }

  return (
    <div className='edit-container'>
       <div className="edit-section">
        <ClearIcon style={{color:"dodgerblue",cursor:"pointer"}} onClick={Clear}/>
        <div>
        <input type="text" name="fullname" placeholder='Fullname' value={UpdateProfile.fullname} onChange={EditProfile}/>
        <input type="text" name="username" placeholder='Username' value={UpdateProfile.username} onChange={EditProfile}/></div>

        <div>
        <input type="text" className='email' name="email" placeholder='Email' value={UpdateProfile.email} onChange={EditProfile}/>
         <textarea type="text" rows={"1"} name="bio" placeholder='Bio' value={UpdateProfile.bio} onChange={EditProfile}></textarea>
        </div>
        <div>
          <div>
           <input type={olapasswordVisible?'password' :"text"} name="currentpassword" placeholder='Old password' onChange={EditProfile} ref={oldPassword}/>
           <VisibilityIcon className='visiblity' onClick={()=> setold(!olapasswordVisible)}/>
           </div>
           <div>
        <input type={newpasswordVisible?'password' :"text"} name="newpassword" placeholder='New password' onChange={EditProfile} ref={newPassword}/>
         <VisibilityIcon className='visiblity' onClick={()=> setnew(!newpasswordVisible)}/>
        </div>
       </div>
       
        <input type="text" name="link" placeholder='Link' value={UpdateProfile.link} onChange={EditProfile}/>
        {isError && <div style={{color:"red"}}>{error.message}</div>}
        <input className='submit' type="submit" value={LoadUpdate ? "Loadding..":"Update"} onClick={()=> 
        Updateprofile(UpdateProfile)
        
         }/>
       </div>
    </div>
  )
}

export default edit
