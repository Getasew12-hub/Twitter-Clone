import React, { useRef } from 'react'
import "./notification.css"
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { NavLink } from 'react-router-dom';
import Skeleten from '../../skeleten/skeleten';
function norification() {
    const query=useQueryClient();
    const clear=useRef()
const {data:noti,isLoading}=useQuery({
    queryKey:["notification"],
       queryFn:async () => {
      const res= await fetch("https://twitter-clone-ckda.onrender.com/notification/get",{
        credentials:"include"
      });

      const data= await res.json();
      if(!res.ok) throw new Error(data.error || "something is wroung");
      return data;
    },
    
    retry:false,
})

   const {mutate,isPending}=useMutation({
    mutationFn:async () => {
      try {
        const res=await fetch("https://twitter-clone-ckda.onrender.com/notification/deleteall",{
          method:"POST",
          credentials:"include",
        });
       const data=await res.json();
       if(!res.ok) throw new Error (data.error || "someting is error");
         return data;
      } catch (error) {
        throw new Error(error);
        
      }
    },
    onSuccess:()=>{
       
      query.setQueryData(["notification"],[])
       clear.current.classList.add("display")
    },
    retry:false,
  })   
   const {mutate:deleteOne,isPending:load}=useMutation({
    mutationFn:async (id) => {
       
      try {
        const res=await fetch(`https://twitter-clone-ckda.onrender.com/notification/delete/${id}`,{
          method:"DELETE",
          credentials:"include",
        });
       const data=await res.json();
       if(!res.ok) throw new Error (data.error || "someting is error");
         return data;
      } catch (error) {
        throw new Error(error);
        
      }
    },
    onSuccess:(data,id)=>{
       
      query.setQueryData(["notification"],(old)=>{
        return old.filter((val)=> val.id!==id);
      })
      
    },
    retry:false,
  })   

  if(isLoading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>
  const Notifications=noti;

// console.log(unread==0)
    function ClearNoti() {
        clear.current.classList.toggle("display");
    }
   
  return (
    <div>
      <div className="notification-controle">
        <h2>Notification</h2>
        <div><SettingsIcon style={{color:"gray",cursor:"pointer"}} onClick={ClearNoti}/>
        <p ref={clear} className='display' onClick={()=> mutate()}>{isPending ? "Loading.." : "Clear all notification"}</p>
        </div>

      </div>

       {Notifications.map((val,index)=>
      <div className="notification" key={index}>
       
       {val.type=="like" && <p className="like"><FavoriteIcon style={{color:"red",fontSize:"45px"}}/> {val.user[0].username}  <span style={{color:"gray"}}>like your post</span> </p>}

      {val.type=="follow" && <p className="follow"><PersonIcon style={{color:"dodgerblue",fontSize:"45px"}}/>  {val.user[0].username}<span style={{color:"gray"}}> follow you </span></p>}

     {load ? "Loading.." : <DeleteForeverIcon style={{color:"darkred",cursor:"pointer"}} onClick={()=> deleteOne(val.id)} />}
      </div>)}
    </div>
  )
}

export default norification
