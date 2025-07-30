import React, { useRef, useState } from 'react'
import "./createPost.css"
import ImageIcon from '@mui/icons-material/Image';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import imacomprestion from "browser-image-compression"
import { queryFn } from '../../queryFn/queryFn';
import { useQuery } from '@tanstack/react-query';
function creatpost() {
  const {data:user,isLoading:process}=useQuery({queryKey:["auth"],queryFn,retry:false})
  const query=useQueryClient();
    const [PostText,setPosttext]=useState("")
    const [sendImg,setImg]=useState(true)
    const imageInput=useRef()
    const imgDisplay=useRef()
    const Clear=useRef()
  const {mutate:postCreate,isPending}=useMutation({
    mutationFn:async ({text,img}) => {
      try {
        const res=await fetch("http://localhost:5000/post/create",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({text,img}),
          credentials:"include"
        })
        const data=await res.json();
        if(!res.ok) throw new Error(data.error ||  "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
        
      }
    },
    onSuccess:()=>{
      
      toast.success("succesfully create post");
      setPosttext("");
       imgDisplay.current.src=null;
        imageInput.current.value=null;
      query.invalidateQueries({queryKey:["post"]})
    },
    onError:()=>{
      toast.error("faild to post")
    }
  }) 
  
   async function acceptImg(e){
   const file=e.target.files[0];
    if(!file) return;
    setImg(false);
    const previw=URL.createObjectURL(file)
     imgDisplay.current.src=previw;
   const option={
    maxSizeMB:1,
    maxWidthOrHeight:800,
    useWebWorker:true,
 
   }

   const compress=await imacomprestion(file,option);
   URL.revokeObjectURL(previw)
   if(compress){
    setImg(true);
    const reander=new FileReader();
    reander.readAsDataURL(file);
    reander.onload=(e)=>{
      const url=e.target.result;
       imgDisplay.current.src=url;
      
    }
   }
   Clear.current.style.display="block"
    }

    function RemoveImg(){
        imgDisplay.current.src=null;
        imageInput.current.value=null;
        //  Clear.current.style.display="none"
    }
    const userimg=user.profileimg;
    function post(){
         
        const text=PostText;
        const img=imgDisplay.current.src;
       
      sendImg && postCreate({text,img})
    }
  return (
    <div className='creatPost-container'>
      <div className="img-text">
      {userimg && <img src={userimg} alt="" loading='lazzy' />}
      {!userimg && <div className='imagerepleaser'>{user.fullname.slice(0,1)}</div>}
        <textarea name="" id=""   placeholder="What's happning?" onChange={(e)=>setPosttext(e.target.value)} value={PostText}></textarea>
      </div>
      <div className="imgRender">
        <div>
        <img  alt="" ref={imgDisplay}/>
        <ClearIcon style={{display:"none"}} ref={Clear} className='ClearIcon' onClick={RemoveImg}/>
        </div>
      </div>
      <div className="imgaccept">
        <div className="imgInput">
            <ImageIcon className='Cicon' onClick={()=>imageInput.current.click()}/>
            <SentimentSatisfiedAltIcon className='Cicon'/>
        </div>
        <input type="file" name="img" accept='image/*' hidden ref={imageInput} onChange={acceptImg} />
        <button onClick={post}>{isPending? "Loading..." : "Post"}</button>
      </div>
    </div>
  )
}

export default creatpost
