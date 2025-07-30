import React from 'react'
import "./right.css"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import { FollowUnfollow } from '../../queryFn/queryFn'
import SmallSkele from '../../../skeleten/smallSkele'
import Skeleten from '../../../skeleten/skeleten'



function right() {
  const query=useQueryClient()
  const {data:suggestion,isLoading}=useQuery({
    queryKey:['suggestion'],
    queryFn:async () => {
      try {
   
      const res=await fetch("http://localhost:5000/user/sugget",{
        credentials:"include",
      })

      const data= await res.json();
      if(!res.ok) throw new Error(data.error  || "something is wrong");
           return data
      } catch (error) {
        throw new Error(error);
        
      }
    }
  })
  
const {mutate,isPending}=FollowUnfollow()
if(isLoading) return <div style={{display:"flex",justifyContent:"center",marginTop:"10px"}}><Skeleten/></div>

if(suggestion.length==0) return <div style={{textAlign:"center",margin:"10px 0"}}>Not have suggestion follow</div>
function follow(id) {
 mutate(id)
}
  return (
   
    <div className='rightt-container'>
        <h2>Who to follow</h2>
    {suggestion.map((val,index)=>
      <div key={index}>

    
       <div className="userprofile">
    <NavLink to={`profile/${val.id}`}>   <div className="profile">
      {val.profileimg ? <img src={val.profileimg} alt="" /> : <div className='imagereplace'>{val.fullname.slice(0,1)}</div> }
        <div className="user-name">
            <p className='name'>{val.fullname.length>15?val.fullname.slice(0,15)+"..":val.fullname}</p>
             <p className='username'>{val.username}</p>
        </div>
          </div></NavLink> 
        <button  onClick={()=> follow(val.id)}>{isPending?<SmallSkele/> : "Follow"}</button>
       </div>
    
       </div>
       )}
    </div>
  )
}

export default right
