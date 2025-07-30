import { v2 as cloudinary } from "cloudinary";
import db from "../database/database.js"
export const createPost=async (req,res)=>{
    
    try {
        let {text,img}=req.body;
        if(!text && !img  ) return res.status(404).json({error:"you have not input value"});
        if(img){
            const inserimg=await cloudinary.uploader.upload(img);
            img=inserimg.secure_url;
        }
    
     await db.query("INSERT INTO post(text,img,userid) VALUES($1,$2,$3);",[text,img,req.user.id]);

     return res.status(200).json({message:"seccesfully create post"});
        
    } catch (error) {
        console.log("erroron create post",error.message);
        return res.status(500).json({error:"internal server error"});
    }
}

export const allpost=async (req,res) => {
  try {
    const post=await db.query("SELECT * FROM post ORDER BY id DESC");
    const posts=post.rows;

   const relatedVaue=posts.map(async(val)=>{

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
const getallpost=await Promise.all(relatedVaue);

return res.status(200).json(getallpost);
  } catch (error) {
   console.log("error on allpost",error.message);
   return res.status(500).json({error:"internal server error"});
  }  
}

export const LikeUnlike=async (req,res) => {
    try {
        
        const id=parseInt(req.params.id);
        const postowner=await db.query("SELECT userid from post WHERE id=$1;",[id]);
        const owner=postowner.rows[0].userid;
   
        const userget=await db.query("SELECT likepost FROM likepost WHERE likepost=$1 AND postid=$2;",[req.user.id,id])
        if(userget.rows.length>0){
            //unlikepost

            await db.query("DELETE FROM likepost WHERE likepost=$1 AND postid=$2;",[req.user.id,id]);
            await db.query("DELETE FROM notification WHERE froms=$1 AND postid=$2;",[req.user.id,id]);
             const likeUpdate=await db.query("SELECT likepost FROM likepost WHERE postid=$1 AND owner=$2;",[id,owner]);
          const  update=likeUpdate.rows.map((val)=> val.likepost)
            const getupdate=await Promise.all(update)
            return res.status(200).json(getupdate)
        }else{
            //like
            await db.query("INSERT INTO likepost(likepost,postid,owner) VALUES($1,$2,$3);",[req.user.id,id,owner]);
            await db.query("INSERT INTO notification(froms,touser,type,read,postid) VALUES($1,$2,$3,$4,$5);",[req.user.id,owner,'like','unread',id]);
            const likeUpdate=await db.query("SELECT likepost FROM likepost WHERE postid=$1 AND owner=$2;",[id,owner]);
            const  update=likeUpdate.rows.map((val)=> val.likepost)
            const getupdate=await Promise.all(update)
            return res.status(200).json(getupdate)

        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"internal server error"});
    }
}
export const comment=async (req,res)=>{
    try {
        const id=parseInt(req.params.id);
        const {text}=req.body;
        
        if(!text) return res.status(404).json({error:"Enter value"});
         const postowner=await db.query("SELECT userid from post WHERE id=$1;",[id]);
        const owner=postowner.rows[0].userid;

        await db.query("INSERT INTO comments(text,userid,postid,owner) VALUES($1,$2,$3,$4);",[text,req.user.id,id,owner]);


          const comment=await db.query("SELECT c.text,c.postid,u.username,u.fullname,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid WHERE postid=$1 AND owner=$2 ORDER BY c.id DESC;",[id,owner]);
        return res.status(200).json(comment.rows);
    } catch (error) {
        console.log("error on comment",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const removePost=async (req,res)=>{
   
    try {
        const id=req.params.id;
      const postowner=await db.query("SELECT userid from post WHERE id=$1;",[id]);
        const owner=postowner.rows[0].userid;
        if(owner!==req.user.id) return res.status(404).json({error:"you can not to be delete post"})
         
      await db.query("DELETE FROM post WHERE userid=$1 AND id=$2;",[owner,id]);

      return res.status(200).json({message:"succesfully delete post"})
    } catch (error) {
       console.log("error on deletepost",error.message);
        res.status(500).json({error:"internal server error"});  
    }
}

export const followPost=async (req,res) => {
   
    try {
       const following=await db.query("SELECT * FROM folow WHERE userid=$1;",[req.user.id]);
       const followPost=following.rows;
  
       if(followPost.length>0){
       const getpost=followPost.map(async(val)=>{
        const post=await db.query("SELECT * FROM post WHERE userid=$1;",[val.following])
        return post.rows
       })
       const wait=await Promise.all(getpost);
       const posts=wait.flat();
  
      
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

       const getfollowpost=await Promise.all(getuser);
      
      return res.status(200).json(getfollowpost);
    }

    return res.status(200).json([])
    } catch (error) {
          console.log("error on followpost",error.message);
        res.status(500).json({error:"internal server error"}); 
    }
}