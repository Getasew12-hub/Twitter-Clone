import React, { useRef, useState } from 'react'
import "./post.css"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { NavLink, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';
import { useQuery } from '@tanstack/react-query';
import { queryFn } from '../../queryFn/queryFn';
import SmallSkele from '../../../skeleten/smallSkele';
function post({post}) {
  const deletePost=useRef();
  const userMore=useRef();
    const {data:user,isLoading:process}=useQuery({queryKey:["auth"],queryFn,retry:false})
const Comment_contain=useRef();
 const query=useQueryClient()
const [CommentText,setComment]=useState("")
   const {mutate:like,isPending}=useMutation({
  
    mutationFn:async (id) => {
      console.log("i click",id)
      const res=await fetch(`https://twitter-clone-ckda.onrender.com/post/like/${id}`,{
        method:"POST",
        credentials:"include",
      })
      const data=await res.json();
      if(!res.ok) throw new Error(data.error   || "someting is wrong");
      return data;
    },
    onSuccess:(data,id)=>{
     
      query.setQueryData(['post'],(old)=>{
        
         return   old.map((val)=>{
                if(val.id==id){
              return {
                ...val,
                like:data,
              }
                }
                return val;
            })
      })
     
    },
    onError:(err)=>{
      console.log(err)
      toast.error("faid to like ")
    }
   });

   const {mutate:commentGet,isPending:Loading}=useMutation({
     mutationFn:async ({id,text}) => {
   
      const res=await fetch(`https://twitter-clone-ckda.onrender.com/post/comment/${id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({text}),
        credentials:"include",
      })
      const data=await res.json();
      if(!res.ok) throw new Error(data.error   || "someting is wrong");
      return data;
    },
    onSuccess:(data,id)=>{
      const userid=id.id;
       setComment("")
      query.setQueryData(['post'],(old)=>{
       
         return   old.map((val)=>{
                if(val.id==userid){
              return {
                ...val,
                comment:data,
              }
                }
                return val;
            })
      })
     
    },
    onError:()=>{
      toast.error("faid to like ")
    }
   })

   const {mutate:deleteUserPost,isPending:loadDelete}=useMutation({
    
     mutationFn:async (id) => {
        console.log(id)
      const res=await fetch(`https://twitter-clone-ckda.onrender.com/post/delete/${id}`,{
        method:"DELETE",
       
        credentials:"include",
      })
      const data=await res.json();
      if(!res.ok) throw new Error(data.error   || "someting is wrong");
      return data;
    },
    onSuccess:(data,id)=>{
     
    
      toast.success("success")
      query.setQueryData(['post'],(old)=>{
         
         return old.filter((val)=> val.id!=id)
      })
     
    },
    onError:()=>{
      toast.error("faid to delete ")
    }
   })
  let optimizedImageUrl;
  if(post.img){
   optimizedImageUrl = post.img.replace(
  "/upload/", // This is the segment we want to target
  "/upload/f_auto,q_auto,w_auto/" // Insert your desired transformations here
);}
  let optimizedProfile;
  if(post.user.profileimg){
   optimizedProfile = post.user.profileimg.replace(
  "/upload/", // This is the segment we want to target
  "/upload/f_auto,q_auto,w_auto/" // Insert your desired transformations here
);}


const userLikePost=post.like.includes(user.id)

function Comment(){
 
 Comment_contain.current.style.visibility="visible"

}
  function removeComment(){

 Comment_contain.current.style.visibility="hidden"
  }
 function addComment(){
  const text=CommentText;
  const id=post.id;
    commentGet({id,text})
 }

 function More(){
if(post.userid==user.id){
  return deletePost.current.classList.toggle("display");
}

return userMore.current.classList.toggle("display");
 }
  return (
    
    <div className='post-container'>
 <NavLink to={`/profile/${post.user.id}`}>  <div className="userprofile">
     {post.user.profileimg ?   <img src={optimizedProfile } alt="" loading='lazy'/> : <div className='imgreplece'>{post.user.fullname.slice(0,1)}</div>} 
        <div className="user-name">
            <p>{post.user.fullname}</p>
            <p className='username'>{post.user.username}</p>
        </div>
    </div></NavLink> 
    <div className="text-post">
        <p>{post.text}</p>
    </div>

  {post.img && <div className="post-img">
        <img src={optimizedImageUrl} alt="" loading='lazy' />
    </div>}

    <div className="response-icon">
    <p  onClick={Comment} className='icon'> <ChatBubbleOutlineIcon   />{post.comment.length}</p>

    {!userLikePost && <p onClick={()=> like(post.id)} className='icon'> <FavoriteBorderIcon  />{post.like.length}</p>}

   {userLikePost && <p onClick={()=> like(post.id)} className='icon'><FavoriteIcon style={{color:"white"}} /> {post.like.length}</p>}
    <div className='icon moreIcon' onClick={More}> <MoreVertIcon/>
       <p className='delete display' ref={deletePost} onClick={()=> deleteUserPost(post.id)} >{loadDelete ? "Loading.." :"Delete post"}</p>
      <NavLink to={`/profile/${post.userid}`}><p className='userMore display' ref={userMore} >User Profile</p></NavLink> 
    </div>


    </div>

    <div className='comment-container'  ref={Comment_contain}>
        <div className="comment-section">
            <ClearIcon className='Cicon' onClick={removeComment}/>
            <h2>Comments</h2>


      <div className="comment-user-profi">
        {post.comment.length>0 ? post.comment.map((val,index)=> <div className='userpro' key={index}>
        
           <div>
           {val.profileimg &&<img src={val.profileimg} alt="" />}
           {!val.profileimg && <div className='imagereplace'>{val.fullname.slice(0,1)}</div>}
            <p>{val.fullname}</p>
            <p className='usernamePlace'>{val.username}</p></div>
           
           <div className="user-comment">
             <p>{val.text}</p>
           </div>
           </div>) :<p>No comment yet😉 Be the first one😊</p>}
    
          </div> 
         
           <div className="add-comment">
            <div>
          {user.profileimg ? <img src={user.profileimg } alt="" /> :
          <div className='imagereplace'>{user.fullname.slice(0,1)}</div>
          
          }
            <p>{user.fullname}</p>
            <p className='username'>{user.username}</p></div>
            <div className="add-sendComment">
            <textarea name="comment" placeholder='Add your comment' onChange={(e)=> setComment(e.target.value)} value={CommentText}></textarea>
            <button onClick={addComment}>Add</button>
                 </div>
           </div>
        </div>
    
    </div>
    </div>
  )
}

export default post
