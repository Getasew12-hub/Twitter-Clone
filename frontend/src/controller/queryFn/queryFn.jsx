import { useMutation, useQueryClient } from "@tanstack/react-query";


export const queryFn=async () => {
         const res= await fetch("http://localhost:5000/auth/authuser",{
        credentials:"include"
      });

      const data= await res.json();
      if(!res.ok) throw new Error(data.error || "something is wroung");
      return data;
}

export const FollowUnfollow=()=>{
  const query=useQueryClient()
const {mutate,isPending}=useMutation({
  mutationFn:async (id) => {
          try {
   
      const res=await fetch(`http://localhost:5000/user/follow/${id}`,{
        method:"POST",
        credentials:"include",
      })

      const data= await res.json();
      if(!res.ok) throw new Error(data.error  || "something is wrong");
           return data
      } catch (error) {
        throw new Error(error);
        
      }
  },
  onSuccess:(data,id)=>{
         
           const intId=parseInt(id)
      query.invalidateQueries({queryKey:["suggestion"]})
   
      query.setQueryData(["followId"],(old)=>{
        console.log(old.includes(intId))
        if(old.includes(intId)){
          return old.filter((val)=> val!==intId);
        }
        old.push(intId)
        return old;
      })
  },
  onError:(error)=>{
   
    toast.error("Faild to follow")
  }
})

return {mutate,isPending};
}