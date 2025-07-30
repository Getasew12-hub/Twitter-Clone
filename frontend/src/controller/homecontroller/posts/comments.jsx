import React from 'react'
import "./comments.css"
import ClearIcon from '@mui/icons-material/Clear';
function comments({comment,id,length}) {
console.log(id)
console.log(comment)
  function removeComment(){
  
      const commentGet=document.querySelector(".comment-container");
  commentGet.style.visibility="hidden"
  }
  return (
    <div className='comment-container'>
        <div className="comment-section">
            <ClearIcon className='Cicon' onClick={removeComment}/>
            <h2>Comments</h2>

      
      <div className="comment-user-profi">
          {length  &&
           <div>
            <img src="/boy1.png" alt="" />
            <p>name</p>
            <p className='username'>username</p></div>}
           
          {length  && <div className="user-comment">
             <p>comment</p>
           </div>}
           
      {!length && <div>No one have yet add comment,be the first one</div>}
          </div> 
         
           <div className="add-comment">
            <div>
            <img src="/boy1.png" alt="" />
            <p>name</p>
            <p className='username'>username</p></div>
            <div className="add-sendComment">
            <textarea name="comment" placeholder='Add your comment'></textarea>
            <button>Add</button>
                 </div>
           </div>
        </div>
    
    </div>
  )
}

export default comments
