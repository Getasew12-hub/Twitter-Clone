import passport from "passport"
import express from "express";
import { Strategy } from "passport-local"
import db from "../database/database.js";
import bcrypt from "bcrypt";
const saltRound=10;
export const Login= async(req,res)=>{
  try{

    const {email,password}=req.body;
    
   const result=await db.query("SELECT u.*,p.profileimg,p.coverimg,p.link,p.bio FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.email=$1;",[email]);
          if(result.rows.length>0){
            const userpassword=result.rows[0].password;
            const user=result.rows[0];
       
            bcrypt.compare(password,userpassword,(err,resu)=>{
                if(err){
                    return res.status(500).json({error:"internal sever error"})
                }else{
                    if(resu){
                    req.login(user,()=>{
                        return res.status(200).json(user);
                        })
                    }else{
                        return res.status(404).json({error:"incorrect password"})
                    }
                }
            })
          }else{
            return res.status(404).json({error:"Email is not found"});
          }
  }catch(err){
   console.log("err on login",err.message);
   return res.status(500).json({error:"internal server error error"});
  }
}
export const Signup=async (req,res)=>{
    try {
        const {email,username,fullname,password}=req.body;
        const result=await db.query("SELECT * FROM userinfo WHERE email=$1;",[email]);
        if(result.rows.length>0){
            return res.status(400).json({error:"Email already exsist"})
        }
        if(!username || !fullname || !password || !email) return res.status(404).json({error:"Enter all inputs"});
        if(password.length<6) return res.status(400).json({error:"Password charcter is not to be less than 6 character"})

        bcrypt.hash(password,saltRound,async(err,hash)=>{
            if(err){
                return res.status(500).json({error:"internal server error"});
            }else{
                const response=await db.query("INSERT INTO userinfo(fullname,email,password,username)  VALUES($1,$2,$3,$4) RETURNING *;",[fullname,email,hash,username])
                const result=response.rows[0];
               
               await db.query("INSERT INTO profile(profileimg,coverimg,bio,link,userid) VALUES(NULL,NULL,NULL,NULL,$1);",[result.id])
                const getuser=await db.query("SELECT u.*,p.profileimg,p.coverimg,p.link,p.bio FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[result.id])
                const user=getuser.rows[0]
            req.login(user,(err)=>{
                    console.log(err);
                    return res.status(200).json(user)
                })
            }
        })
        
    } catch (error) {
        console.log("error on signup");
        return res.status(500).json({error:"internal server error"})
    }
}
export const Logout=(req,res)=>{
    req.logout((err)=>{
     if(err) return res.status(500).json({error:"internal server error"});
      
     req.session.destroy((err)=>{
        if(err) return res.status(500).json({error:"internal server error"});

        res.clearCookie("user",{path:"/"});
        return res.status(200).json({message:"logout successfully"})
     })
    
    })
}

export const getAuth=async (req,res) => {
   if(req.user){
    return res.status(200).json(req.user);
   }

   return res.status(404).json({error:"unAutorize"});
}

