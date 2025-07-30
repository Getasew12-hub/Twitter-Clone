import db from "../database/database.js"

export const getNoti=async (req,res) => {
    try {
        const getuser=await db.query("SELECT id,froms,type FROM notification WHERE touser=$1 ORDER BY id DESC;",[req.user.id]);
        const getusernoti=getuser.rows
        if(getusernoti.length>0){
            const userprofile=getusernoti.map(async(val) => {
                const user=await db.query("SELECT u.username,u.id,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1  ;",[val.froms])
                return {
                    ...val,
                   user:user.rows
                }
            })

            const getalluser=await Promise.all(userprofile);
            const combineUser=getalluser.flat();
           
            return res.status(200).json(combineUser);

        }
    return res.status(200).json([])
    } catch (error) {
        console.log("errornon get notification",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const unreadNoti=async (req,res) => {
    try {
        const unread=await db.query("SELECT COUNT(*) FROM notification WHERE touser=$1 AND read=$2;",[req.user.id,"unread"]);
       
        return res.status(200).json(unread.rows[0])
    } catch (error) {
          console.log("error on get read",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const readNoti= async (req,res) => {
    try {
        await db.query("UPDATE notification SET read=$1 WHERE touser=$2;",['read',req.user.id])
        return res.status(200).json({message:"succesfully read"})
    } catch (error) {
           console.log("error on get read",error.message);
        res.status(500).json({error:"internal server error"});
    }
}
export const deleteallNoti=async (req,res) => {
    try {
        await db.query("DELETE FROM notification WHERE touser=$1;",[req.user.id]);
        return res.status(200).json({message:"succesfully delete all notification"})
    } catch (error) {
          console.log("error on get delete all",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const deleteNoti=async (req,res) => {
    try {
       
        const id=parseInt(req.params.id);
        await db.query("DELETE FROM notification WHERE touser=$1 AND id=$2",[req.user.id,id]);
        return res.status(200).json({message:"succesfully delete"});
    } catch (error) {
         console.log("error on get delete",error.message);
        res.status(500).json({error:"internal server error"});
    }
}