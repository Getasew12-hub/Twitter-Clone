export const authUser=async(req,res,next)=>{
   if(req.isAuthenticated()){

    next();
   }else{
    res.status(404).json({error:"Unautorize"})
   }
}