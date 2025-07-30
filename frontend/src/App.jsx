
import React,{lazy,Suspense} from 'react'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Login from './page/auth/login/login'
import Signup from './page/auth/signup/signup'
import Home from './page/home/home'
import Profile from './page/profile/profile'
import toast, {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { Navigate,ScrollRestoration } from 'react-router-dom'
import Post from './controller/homecontroller/posts/post'
import Notification from './page/notification/norification'
const Middle=lazy(()=> import ('./controller/homecontroller/middle/middle'))
import Skeleten from './skeleten/skeleten'
function App() {

  const {data,isLoading,Error}=useQuery({
    queryKey:["auth"],
    queryFn:async () => {
      const res= await fetch("https://twitter-clone-ckda.onrender.com/auth/authuser",{
        credentials:"include"
      });

      const data= await res.json();
      if(!res.ok) throw new Error(data.error || "something is wroung");
      return data;
    },
    
    retry:false,
 
  })
if(isLoading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>
  const router=createBrowserRouter([
    
    {
      path:"/",
      element:data ? <Home user={data}/> : <Navigate to={"/login"}/>,
      errorElement:"404 Page is not found",
      children:[
        {
          path:"/",
          element:(
            <Suspense fallback={<div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>}>
                 <Middle user={data}/> 
            </Suspense>
          )
        },
        {
          path:"/profile/:id",
          element:<Profile user={data}/>,
          children:[
            {
              index:true,
              element:<Profile/>
            },
            {
              path:"like",
              element:<Profile/>
            }
          ]
        },
        {
          path:"/following",
          element:(
            <Suspense fallback={<div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>}>
                    <Middle user={data}/>
            </Suspense>
          )
        },
        {
          path:"/notification",
          element:<Notification/>
        }
      ]
    },
    {
      path: "/login",
      element:!data ? <Login/> :<Navigate to="/"/>,

    },
    {
      path: "/signup",
      element:!data ? <Signup/> :<Navigate to="/"/>
    }
  ])
  return (
    <div>
      
      <RouterProvider router={router}>
        <ScrollRestoration/>
      </RouterProvider>
      <Toaster/>
    </div>
  )
}

export default App
