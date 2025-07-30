import React, { useEffect, useRef, useState } from 'react'
import "./middle.css"
import { NavLink } from 'react-router-dom'
import Creatpost from './creatpost'
import Post from '../posts/post'
import { useQuery } from '@tanstack/react-query'
import XIcon from '@mui/icons-material/X';
import Skeleten from '../../../skeleten/skeleten'
function middle({user}) {
  const insmall=useRef();
  const [scrollScre,setScroll]=useState(0);
  const [resize,setResize]=useState(window.innerWidth)
  const scroll=document.querySelector(".miidlebar");
     if(resize<501){
scroll.addEventListener("scroll",()=>{
    

  
    if(scroll.scrollTop>(scrollScre+150)){
      setScroll(scroll.scrollTop)
      insmall.current.style. position= "absolute";
    }else{
      if(scroll.scrollTop<(scrollScre-150)){
        setScroll(scroll.scrollTop)
         insmall.current.style. position= "fixed";
      }
    }

  })}
  window.addEventListener("resize",()=>{
      setResize(window.innerWidth)
 
  })

  const [postType,setPostType]=useState("foryou");

  const Cpost=()=>{
    switch(postType){
      case "foryou":
        return "http://localhost:5000/post/allpost";
      case "follow":
        return "http://localhost:5000/post/followPost";
      default:
        return "http://localhost:5000/post/allpost";
    }
  }

  const url=Cpost();
  const {data:post,isLoading,refetch,isRefetching}=useQuery({
  queryKey:["post"],
  queryFn:async () => {
    try {
 
    const res=await fetch(url,{
      credentials:"include",
      
    })
    
      const data= await res.json();
      if(!res.ok) throw new Error(data.error || "something is wroung");
      return data;
           
    } catch (error) {
      throw new Error(error);
      
    }
  },
  retry:false,
  
})
useEffect(()=>{
  refetch(post)
},[postType])

if(isLoading || isRefetching) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>
  // const scroll=window.pageXOffset;

  return (
    <div className='middle-container'>
      <div className="header-postion" ref={insmall}>
      <div className="user-x" >
               <div className="user-profile">
       <NavLink to={`/profile/${user.id}`} >    <div className="user">
           {user.profileimg ?<img src={user.profileimg} alt="" /> :<div className='imagereplace'>{user.fullname.slice(0,1)}</div>}
             
            </div></NavLink> 
             {/* <LogoutIcon className='Hicon' onClick={logout} /> */}

         </div>
        <XIcon className='xicon'/>
      </div>
         <div className="navigation-link">
            <NavLink to={"/"} end onClick={()=> setPostType("foryou") }>For you</NavLink>
            <NavLink to={"/following"} onClick={()=> setPostType("follow")}>Following</NavLink>
         </div>
</div>


         <div className="create-post">
        <Creatpost />
         </div>
         <div className="homepost-container">
       {post.length===0 && <div style={{textAlign:"center"}}> Not have following post👻</div>}
       {post.map((val,index)=> <div className="home-post" key={index}>
          
          <Post post={val}/>
         </div>
         )} 
         </div>
    </div>
  )
}

export default middle
