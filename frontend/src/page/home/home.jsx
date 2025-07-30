import React,{useState} from 'react'
import Left from '../../controller/homecontroller/left/left'
import Right from "../../controller/homecontroller/right/right"
import XIcon from '@mui/icons-material/X';
import LogoutIcon from '@mui/icons-material/Logout';
import "./home.css"
import { Link, Outlet ,NavLink} from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryFn } from '../../controller/queryFn/queryFn';


function home({user}) {


const query=useQueryClient();
const {data:auth,isLoading}=useQuery({queryKey:["auth"],queryFn,retry:false})
  const [state,setState]=useState((window.innerWidth))
  
  const {mutate,isPending}=useMutation({
    mutationFn:async () => {
      try {
        const res=await fetch("http://localhost:5000/auth/logout",{
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
      query.setQueryData(["auth"],null)
    },
    retry:false,
  })
  window.addEventListener("resize",()=>{
    setState(window.innerWidth)
  })
 function logout(){
mutate();
 }
 if(isLoading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>
  return (
    <div className='home-container'>
      
        <div className="leftsidebar">
          <XIcon className='xicon'/>
      <Left user={user}/>
         <div className="user-profile">
       <NavLink to={`/profile/${user.id}`} >    <div className="user">
           {user.profileimg ?<img src={user.profileimg} alt="" /> :<div className='imagereplace'>{user.fullname.slice(0,1)}</div>}
                <div className="name">
                  {state >1260 &&  <p>{user.fullname.length>10 ? user.fullname.slice(0,10)+".." : user.fullname }</p>} 
                  {state >1260 &&   <p className='username'>{user.username.length>10 ? user.username.slice(0,10)+"..": user.username }</p>}
                </div>
            </div></NavLink> 
             <LogoutIcon className='Hicon' onClick={logout} />

         </div>
         </div>

         <div className="miidlebar">
            <Outlet/>
         </div>
         <div className="right-sidebar">
            <Right/>
         </div>
 
    </div>
  )
}

export default home
