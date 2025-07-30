import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
import { NavLink, useParams, Outlet } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryFn } from "../../controller/queryFn/queryFn";
import Post from "../../controller/homecontroller/posts/post";
import { FollowUnfollow } from "../../controller/queryFn/queryFn";
import { useMutation } from "@tanstack/react-query";
import EditProfile from "./EditProfile"
import toast from "react-hot-toast";
import SmallSkele from "../../skeleten/smallSkele";
import Skeleten from "../../skeleten/skeleten";
function profile({ user }) {
  const query = useQueryClient();
  const [isHavecoverImg, setCoverImg] = useState(false);
  const [isHaveImage, SetImage] = useState(true);
  const coverimagePrewiew = useRef();
  const imageAccept = useRef();
  const updateButton = useRef();
  const ProfileImgPreieview = useRef();
  const imageProfile = useRef();
  const { id } = useParams();

  const { data: followid, isLoading: loadFollowId } = useQuery({
    queryKey: ["followId"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5000/user/folllowId", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const { data: auth, isLoading: process } = useQuery({
    queryKey: ["auth"],
    queryFn,
    retry: false,
  });

  const [PostLike, setLikePost] = useState("post");

  const userchice = () => {
    switch (PostLike) {
      case "post":
        return "http://localhost:5000/user/userPost/";
      case "like":
        return "http://localhost:5000/user/userLike/";
      default:
        return "http://localhost:5000/user/userPost/";
    }
  };
  const url = userchice();
  const {
    data: userpost,
    isLoading: postLoad,
    refetch: repost,
    isRefetching: reloading,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      try {
        const res = await fetch(url + id, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const {
    data: profile,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/profile/${id}`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  const { mutate, isPending } = FollowUnfollow();

  const { mutate: UpdateUserImge, isPending: LoadUpdate } = useMutation({
    mutationFn: async ({ profileimg, coverimg }) => {
      const res = await fetch("http://localhost:5000/user/editimg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileimg, coverimg }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "someting is wrong");
      return data;
    },
    onSuccess: (data) => {
     
      toast.success("success");
  
if(data.profileimg){
  query.setQueryData(["auth"],(old)=>{
    return { ...old,
      profileimg:data.profileimg || old.profileimg,
    }
  });
}
     query.setQueryData(["profile"],(old)=>{
      
      return  { ...old,
        profileimg:data.profileimg || old.profileimg,
        coverimg:data.coverimg || old.coverimg,
    }  
     })
     if(data.profileimg){
    query.invalidateQueries({queryKey:["post"]})}
    },
    onError: (err) => {
      console.log(err);
      toast.error("faid to update ");
    },
  });

  useEffect(() => {
    repost();
  }, [PostLike, id]);
  useEffect(() => {
    refetch();
  }, [id]);
  if (
    isLoading ||
    process ||
    isRefetching ||
    postLoad ||
    reloading ||
    loadFollowId
  )
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><Skeleten/></div>;
   
  function follow() {
    mutate(id);
  }

  function Edit(e) {
    const file = e.target.files[0];
    if (file) {
      const reander = new FileReader();
      reander.readAsDataURL(file);
      reander.onload = (e) => {
        updateButton.current.removeAttribute("hidden");
        SetImage(true);
     
        coverimagePrewiew.current.src = e.target.result;
      };
    }
  }
  function ProfiImg(e) {
    const file = e.target.files[0];
    if (file) {
       setCoverImg(true);
      const reander = new FileReader();
      reander.readAsDataURL(file);
      reander.onload = (e) => {
        updateButton.current.removeAttribute("hidden");
       
       
        ProfileImgPreieview.current.src = e.target.result;
      };
    }
  }

  function UpdateProfileImg() {
    const profileimg = ProfileImgPreieview.current.src;
    const coverimg = coverimagePrewiew.current.src;
    UpdateUserImge({ profileimg, coverimg });
  }
  const intId = parseInt(id);
  const followUnfolllow = followid.includes(intId);
  const profileimg = profile.profileimg;
  const authUser = auth.id == id;

  let optimizedProfile;
  if (profileimg) {
    optimizedProfile = profileimg.replace(
      "/upload/", // This is the segment we want to target
      "/upload/f_auto,q_auto,w_auto/" // Insert your desired transformations here
    );
  }

  function EditMyProfile(){
    document.querySelector(".edit-container").style.visibility="visible";
  }
  return (
    <div className="profile-container">
      <div className="username">
        <p>
          <KeyboardBackspaceIcon
            className="Picon"
            onClick={() => window.history.back()}
          />
        </p>
        <div className="name">
          <div>
            <p>{profile.fullname}</p>
            <p className="user">{profile.username}</p>
          </div>
          <p>{profile.post_num} <span style={{color:"gray"}}>Posts</span> </p>
        </div>
      </div>
      <div className="userimage">
        <div className="coverimg">
          <input
            hidden
            type="file"
            name="image"
            accept="image/*"
            ref={imageAccept}
            onChange={Edit}
          />

          {(profile.coverimg || isHaveImage) && (
            <img
              ref={coverimagePrewiew}
              src={profile.coverimg}
             
            />
          )}
          {authUser && (
            <EditIcon
              className="Picon"
              onClick={() => imageAccept.current.click()}
            />
          )}
        </div>
        <div className="profileimg">
          <input
            hidden
            type="file"
            name="image"
            accept="image/*"
            ref={imageProfile}
            onChange={ProfiImg}
          />

          {profileimg || isHavecoverImg ? (
            <img
              src={optimizedProfile}
              ref={ProfileImgPreieview}
              onClick={() => 
                
                authUser &&  imageProfile.current.click()
                }
              loading="lazzy"
            />
          ) : (
            <div
              className="imagereplace"
              onClick={() => authUser &&  imageProfile.current.click()}
            >
              {profile.fullname.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="update-button">
          {authUser && (
            <button
              className="update"
              hidden
              ref={updateButton}
              onClick={UpdateProfileImg}
            >
              {LoadUpdate ? <SmallSkele/> : "Update"}
            </button>
          )}
          {authUser && <button className="edit" onClick={EditMyProfile}>Edit Profile</button>}
          {!authUser && !followUnfolllow && (
            <button onClick={follow}>
              {isPending ? <SmallSkele/> : "Follow"}{" "}
            </button>
          )}
          {!authUser && followUnfolllow && (
            <button onClick={follow}>
              {" "}
              {isPending ? <SmallSkele/> : "Unfollow"}
            </button>
          )}
        </div>
      </div>

      <div className="userdetail">
        <h2>{profile.fullname}</h2>
        <h4 className="username">{profile.username}</h4>
        <div className="info">
          <p className="link">
            <LinkIcon className="Picon" style={{color:"gray"}}/> {profile.link}
          </p>
          <p className="join">
            <CalendarTodayIcon className="Picon" style={{color:"gray"}} /> {profile.bio}
          </p>
        </div>
        <div className="follow">
          <p>{profile.following} <span style={{color:"gray"}}>following</span> </p>
          <p>{profile.follows} <span  style={{color:"gray"}}>followers</span> </p>
        </div>
      </div>
      <div className="user-posts-like">
        <NavLink to={"."} end onClick={() => setLikePost("post")}>
          <h3>Posts</h3>{" "}
        </NavLink>
        <NavLink to={"like"} onClick={() => setLikePost("like")}>
          <h3>Likes</h3>
        </NavLink>
      </div>
      {userpost.length == 0 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          Not have {PostLike}👻
        </div>
      )}

      <div className="edit-profile">
       <EditProfile user={auth}/>
      </div>
      {userpost.map((val, index) => (
        <div className="post-like" key={index}>
          <Post post={val} />
        </div>
      ))}
       
    </div>
  );
}

export default profile;
