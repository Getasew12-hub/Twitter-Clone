import React from 'react'
import "./left.css"

import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery ,useMutation, useQueryClient} from '@tanstack/react-query';
import Skeleten from '../../../skeleten/skeleten';

function left({user}) {
  const query=useQueryClient();
  const {data:unread,isLoading}=useQuery({
    queryKey:["unread"],
       queryFn:async () => {
      const res= await fetch("https://twitter-clone-ckda.onrender.com/notification/isread",{
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
        const res=await fetch("https://twitter-clone-ckda.onrender.com/notification/read",{
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
      query.setQueryData(["unread"],0)
    },
    retry:false,
  })  
const [state,setState]=useState((window.innerWidth))
  window.addEventListener("resize",()=>{
setState(window.innerWidth)
  })


if(isLoading) return <div style={{display:"flex",justifyContent:"center",marginTop:"10px"}}><Skeleten/></div>
function NowRead(){
   mutate();
}
const read=unread.count;

  return (
    <div>
      <div className="left-container">
       
         <div className="navigation-link">
          <NavLink to={"/"}><p><HomeFilledIcon className='Licon'/>{state > 1260 && "Home"}</p> </NavLink>  

           <NavLink to={"/notification"}><div className='noti' onClick={NowRead} > <NotificationsIcon className='Licon'/>{state > 1260 && "Notification"}
          {read>0 && <div className='unreadNoti'>{ read}</div>}
           </div></NavLink> 

          <NavLink to={`/profile/${user.id}`}><p><PersonIcon className='Licon'/>{state >1260 && "Person"}</p> </NavLink> 
         </div>
      
      </div>
    </div>
  )
}

export default left
