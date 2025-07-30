import db from "../database/database.js"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary";

export const suggestUser=async (req,res)=>{
    try {
  
        const userSuggest=await db.query("SELECT u.id,u.fullname,u.username,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id NOT IN (SELECT following FROM folow WHERE userid=$1 ) AND u.id!=$2 ORDER BY RANDOM() LIMIT 4;",[req.user.id,req.user.id])
        

        return res.status(200).json(userSuggest.rows)
     
    } catch (error) {
        console.log("error on suggest user",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const followUnfollow=async (req,res) => {
  
  try {
    const id=parseInt(req.params.id);
   
  const isFollow=await db.query("SELECT * FROM folow WHERE userid=$1 AND following=$2;",[req.user.id,id]);
  const getfolow=isFollow.rows;

  if(getfolow.length>0){
//unfollow
   await db.query("DELETE FROM folow WHERE userid=$1 AND following=$2;",[req.user.id,id])
   await db.query("DELETE FROM followers WHERE followers=$1 AND userid=$2;",[req.user.id,id])
   await db.query("DELETE FROM notification WHERE touser=$1 AND froms=$2 AND type=$3;",[req.user.id,id,"follow"])

   return res.status(200).json({message:"sucessfuly unfollow"})
  }
    //following
   
    await db.query("INSERT INTO folow(following,userid) VALUES($1,$2);",[id,req.user.id])
    await db.query("INSERT INTO followers(followers,userid) VALUES($1,$2);",[req.user.id,id]);
   await db.query("INSERT INTO notification(froms,touser,type,read) VALUES($1,$2,$3,$4);",[req.user.id,id,"follow","unread"]);

    return res.status(200).json({message:"succesfully follow"});
  
  } catch (error) {
     console.log("error on follow unfollow user",error.message);
        res.status(500).json({error:"internal server error"});
  }
  
}

export const profile=async (req,res) => {
  
  try {
    
    const id=(req.params.id);
    const userprofile=await db.query("SELECT u.username,u.fullname,p.*,(SELECT COUNT(*) FROM post WHERE userid=u.id) AS post_num ,(SELECT COUNT(*) FROM folow WHERE userid=u.id) AS following,(SELECT COUNT(*) FROM followers WHERE userid=u.id) AS follows FROM userinfo u LEFT JOIN profile p ON p.userid=u.id  WHERE u.id=$1;",[id])
  
    return res.status(200).json(...userprofile.rows);
  } catch (error) {
         console.log("error on  user profile",error.message);
        res.status(500).json({error:"internal server error"});
  }
}

export const editprofile=async (req,res) => {
  try {
    let {fullname,username,email,link,bio,currentpassword,newpassword}=req.body;

       if((currentpassword && !newpassword) || (newpassword && !currentpassword)) return res.status(404).json({error:"Enter both password"});
       if(currentpassword){
        
       const password=await db.query("SELECT password FROM userinfo WHERE id=$1;",[req.user.id])
       const pass=password.rows[0].password;
         const result=await bcrypt.compare(currentpassword,pass)
        
         if(!result) return res.status(404).json({error:"your old password is incorrect"})
       }
      if(newpassword){
        if(newpassword.length<6) return res.status(404).json({error:"password length not be less than 6 characters"})
          const saltRound=10;
          bcrypt.hash(newpassword,saltRound,async(err,hash)=>{
           await db.query("UPDATE userinfo SET password=$1 WHERE id=$2 ;",[hash,req.user.id])
        
          })
      }

      const name=fullname || res.user.fullname;
      const userna=username || req.user.username;
      const emai=email || req.user.emai;
      const lin=link || req.user.link;
      const bi=bio || req.user.bio;

   req.user.fullname=fullname || res.user.fullname;
     req.user.username=username || req.user.username;
    req.user.emai=email || req.user.emai;
      req.user.link=link || req.user.link;
     req.user.bio=bio || req.user.bio;
  
  const update=await db.query("UPDATE userinfo SET fullname=$1,username=$2,email=$3 WHERE id=$4;",[name,userna,emai,req.user.id]);
  const updateProfile=await db.query("UPDATE profile SET link=$1,bio=$2 WHERE userid=$3;",[lin,bi,req.user.id]);
  return res.status(200).json({message:"succesfully update"});

  } catch (error) {
     console.log("error on  user update profile",error.message);
        res.status(500).json({error:"internal server error"});
  }
}

export const userPost=async (req,res) => {
  try {
    
    const {id}=req.params;
    
    const post=await db.query("SELECT * FROM post WHERE userid=$1;",[id])
    const posts=post.rows;
    if(posts.length>0){
      const getuser=posts.map(async(val)=>{
           const user=await db.query("SELECT u.id,u.fullname,u.email,u.username,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[val.userid]);
      const comment=await db.query("SELECT c.text,c.postid,u.username,u.fullname,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid WHERE postid=$1 AND owner=$2 ORDER BY c.id DESC;",[val.id,val.userid]);
           const like=await db.query("SELECT likepost FROM likepost WHERE postid=$1 AND owner=$2;",[val.id,val.userid]);
      
        const  likearray=like.rows.map((val)=> val.likepost)
            const getupdate=await Promise.all(likearray)
    
    return {
        ...val,
        user:user.rows[0],
        comment:comment.rows,
        like:getupdate,
    }
      })

      const userpost=await Promise.all(getuser);

      return res.status(200).json(userpost);
    }

   return res.status(200).json([])
  } catch (error) {
      console.log("error on  user user post",error.message);
        res.status(500).json({error:"internal server error"});
  }
}

export const userLike=async (req,res) => {
  try {
    const {id}=req.params
    const likepost=await db.query("SELECT * FROM likepost WHERE likepost=$1;",[id]);
    const likes=likepost.rows;
    
    if(likes.length>0){
const getpost=likes.map(async(val)=>{
  const allPost=await db.query("SELECT * FROM post WHERE userid=$1 AND id=$2",[val.owner,val.postid])
  return allPost.rows
})

const iLikepost=await Promise.all(getpost);
const inone=iLikepost.flat()

            const getuser=inone.map(async(val)=>{
           const user=await db.query("SELECT u.id,u.fullname,u.email,u.username,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[val.userid]);
    const comment=await db.query("SELECT c.text,c.postid,u.username,u.fullname,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid WHERE postid=$1 AND owner=$2 ORDER BY c.id DESC;",[val.id,val.userid]);
   
     
         const like=await db.query("SELECT likepost FROM likepost WHERE postid=$1 AND owner=$2;",[val.id,val.userid]);
      
        const  likearray=like.rows.map((val)=> val.likepost)
            const getupdate=await Promise.all(likearray)

    return {
        ...val,
        user:user.rows[0],
        comment:comment.rows,
        like:getupdate,
    }
      })
     const getlikepost=await Promise.all(getuser);
      return res.status(200).json(getlikepost);

    }

    return res.status(200).json([])
  } catch (error) {
     console.log("error on  user like",error.message);
        res.status(500).json({error:"internal server error"});
  }
}

export const editimg =async (req,res) => {
 
  try {
   
    let {profileimg,coverimg}=req.body;
    if(profileimg){
    
      if(req.user.profileimg){
        cloudinary.uploader.destroy(req.user.profileimg.split("/").pop().split(".")[0]);
         
      }
      const updateimg=await cloudinary.uploader.upload(profileimg);
      profileimg=updateimg.secure_url;
       
    }
  
    if(coverimg){
    if(req.user.coverimg){
        cloudinary.uploader.destroy(req.user.coverimg.split("/").pop().split(".")[0]);
    }
       const updateimg=await cloudinary.uploader.upload(coverimg);
      coverimg=updateimg.secure_url;
    }

    const profile=profileimg || req.user.profileimg;
    const cover=coverimg || req.user.coverimg;
    const udate=await db.query("UPDATE profile SET profileimg=$1,coverimg=$2 WHERE userid=$3 RETURNING profileimg,coverimg,userid;",[profile,cover,req.user.id])
        if(profileimg){
    req.user.profileimg=udate.rows[0].profileimg || req.user.profileimg}
    return res.status(200).json(...udate.rows)

  } catch (error) {
       console.log("error on  user update img",error.message);
        res.status(500).json({error:"internal server error"});
  }


}

export const folllowId=async (req,res) => {
  try {
    const follow=await db.query("SELECT following FROM folow WHERE userid=$1;",[req.user.id]);
    const followdata=follow.rows.map((val)=>{
      return val.following;
    })

    const getfollow=await Promise.all(followdata);
   
    return res.status(200).json(getfollow);

  } catch (error) {
    console.log("error on the followid",error.message);
    res.status(500).json({error:"internal server error"})
  }
}