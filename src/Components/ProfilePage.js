import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const ProfilePage = (props) => {
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [sport, setSport] = useState("");
    const [sportTeam, setSportTeam] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    
    useEffect(() => {
        //if your computer is slower this may take a while becauase of the profile picture
        axios.get('http://localhost:8000/api/user/getlogged', {withCredentials: true})
            .then(res => { 
                setFullName(res.data.fullName);
                setBio(res.data.bio);
                setCity(res.data.city);
                setState(res.data.state);
                setSport(res.data.sport);
                setSportTeam(res.data.sportTeam);
                setBirthday(res.data.birthDate);
                setGender(res.data.gender);
                setPhoto(res.data.photo);
                let date = res.data.createdAt;
                let formatedDate = "";
                for (let i = 0; i < date.length; i++) {
                    if (date[i] === "T") {
                        break;
                    }
                    formatedDate += date[i];
                }
                setCreatedAt(formatedDate);
            })
            .catch(err => { 
                console.log(err)
            });
    }, [])

    const logOutButton = (e) => {
        e.preventDefault();
        axios.get('http://localhost:8000/api/user/logout', {withCredentials: true})
            .then(res => navigate('/'))
            .catch(err => console.log(err));
    }

    const [postMessage, setPostMessage] = useState("");
    const [postError, sePostError] = useState("");
    const [count, setCount] = useState(0);
    const postFormSubmition = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/createPost', {postMessage, fullName}, {withCredentials: true})
            .then(res => {
                setPostMessage("");
                setCount(count => count + 1);
            })
            .catch(err => console.log(err));
    }
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/api/grabPostsForLoggedUser', {withCredentials: true})
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.log(err));
    }, [count])
    const deletePost = (e, postId) => {
        e.preventDefault();
        axios.delete('http://localhost:8000/api/deletePost/' +postId, {withCredentials: true} )
            .then(res =>{ 
                setCount(count => count + 1);
            })
            .catch(err => console.log(err));
    }

    const [commentMessage, setCommentMessage] = useState("");
    const [commentFormPopulate, setCommentFormPopulate] = useState(false);
    const [commentIndexForCommentFormPopulate, setCommentIndexForCommentFormPopulate] = useState(null);

    return (
        <div className='profile-container'>
        <>
        <div className='profile-header'>
            <header>
                <div className='profile-info'>
                <img alt="You" src={photo} style={{
                    height: "100px",
                    width: "150px"}}></img>
                <h2>User: {fullName}</h2>
                </div>
                <div className='profile-buttons'>
                <button onClick={logOutButton}>Logout</button>
                <button onClick={(e) => navigate('/editProfile')}>Edit your Information</button>
                <button onClick={(e) => navigate('/feed')}>Feed</button>
                </div>
            </header>
            </div>
            
            <main>
            <div className='profile-content'>
                <div className="Information">
                    <h4>Information: </h4>
                    <p>Bio: {bio}</p>
                    <p>Lives in {city},{state}</p>
                    <p>Favorite sport is {sport}</p>
                    <p>Favorite sports team is {sportTeam}</p>
                    <p>Birthday: {birthday}</p>
                    <p>Gender: {gender}</p>
                    <p>Joined on: {createdAt}</p>
                </div>
                <div className="Whats-New">
                    <div className="Whats-New-Box">
                    <form onSubmit={postFormSubmition}>
                        <label className='form-label'>What's New</label>
                        <textarea value={postMessage} onChange={(e) => setPostMessage(e.target.value)}></textarea>
                        <button>Submit</button>
                    </form>
                    </div>
                </div>
                </div>
                
                <div className="Posts">
                {
                        posts.map((post, index) => {
                            return (
                            <div key={index} style={{border: "1px solid black"}}>
                                {index === commentIndexForCommentFormPopulate 
                                    ? 
                                    <>
                                            <p>{post.post.userPostingName}</p>
                                            <p>{post.post.message}</p>
                                            <p>Likes {post.numberOfLikes} | Comments {post.numberOfComments}</p>
                                            <div className='interaction'>
                                            <button onClick={(e) => {
                                                axios.delete('http://localhost:8000/api/deletePost/' + post.post._id, {withCredentials: true})
                                                    .then(res => setCount(count => count + 1))
                                                    .catch(err => console.log(err));
                                            }}>Delete Post</button>
                                            {post.userLoggedInIdAlreadyLikedPost === true ? 
                                            <button onClick={(e) => {
                                                axios.delete('http://localhost:8000/api/unlikePost/' + post.likes,
                                                {withCredentials: true})
                                                    .then(res => {
                                                        setCount(count => count + 1);
                                                    })
                                                    .catch(err => console.log(err));
                                            }}>Unlike Post</button>
                                            :
                                            <button onClick={(e) => {
                                                axios.post('http://localhost:8000/api/likePost/' + post.post._id, 
                                                {fullName}, {withCredentials: true})
                                                    .then(res => {
                                                        setCount(count => count + 1);
                                                    })
                                                    .catch(err => console.log(err));
                                            }}>Like Post</button>
                                        }
                                            <button onClick={(e) => {
                                                if (commentFormPopulate === false) {
                                                    setCommentFormPopulate(true);
                                                    setCommentIndexForCommentFormPopulate(index);
                                                } else {
                                                    setCommentFormPopulate(false);
                                                    setCommentMessage("");
                                                    setCommentIndexForCommentFormPopulate(null);
                                                }
                                            }}>Comment</button>
                                            </div>

                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                axios.post('http://localhost:8000/api/createPost/' + post.post._id,
                                                {commentMessage: commentMessage, fullName: fullName},
                                                {withCredentials: true},
                                                )
                                                    .then(res => {
                                                        setCommentMessage("");
                                                        setCount(count => count+1);
                                                    })
                                                    
                                                    .catch(err => console.log(err));
                                            }}>
                                                <label>Make a comment</label>
                                                <textarea onChange={(e) =>  setCommentMessage(e.target.value)} value={commentMessage}></textarea>
                                                <button>Submit Comment</button>
                                            </form>
                                            <div className='Comment-section'>
                                                {
                                                    post.comments.map((comment, index) => {
                                                        return (
                                                            <div key={index} style={{border: "1px solid black", margin: "10px"}}>
                                                                {comment.userLoggedInPostedThisComment === true ? 
                                                                <>
                                                                    <p>{comment.userWhoPostedComment}</p>
                                                                    <p>{comment.commentMessage}</p>
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault();
                                                                        axios.delete("http://localhost:8000/api/deleteComment/" + comment.commentId, {withCredentials: true})
                                                                            .then(res => {
                                                                                setCount(count => count+ 1);
                                                                            })
                                                                            .catch(err => console.log(err));
                                                                    }}>Delete</button>
                                                                </>
                                                                
                                                                : 
                                                                
                                                                <>
                                                                    <p>{comment.userWhoPostedComment}</p>
                                                                    <p>{comment.commentMessage}</p>
                                                                </>
                                                                }
                                                            </div>
                                                            
                                                        );
                                                    })
                                                }
                                            </div>
                                        </>
                                        :
                                        <>
                                            <p>{post.post.userPostingName}</p>
                                            <p>{post.post.message}</p>
                                            <p>Likes {post.numberOfLikes} | Comments {post.numberOfComments}</p>
                                            <button onClick={(e) => {
                                                axios.delete('http://localhost:8000/api/deletePost/' + post.post._id, {withCredentials: true})
                                                    .then(res => setCount(count => count + 1))
                                                    .catch(err => console.log(err));
                                            }}>Delete Post</button>
                                            {post.userLoggedInIdAlreadyLikedPost === true ? 
                                                <button onClick={(e) => {
                                                    axios.delete('http://localhost:8000/api/unlikePost/' + post.likes,
                                                    {withCredentials: true})
                                                        .then(res => {
                                                            setCount(count => count + 1);
                                                        })
                                                        .catch(err => console.log(err));
                                                }}>Unlike Post</button>
                                                :
                                                <button onClick={(e) => {
                                                    axios.post('http://localhost:8000/api/likePost/' + post.post._id, 
                                                    {fullName}, {withCredentials: true})
                                                        .then(res => {
                                                            setCount(count => count + 1);
                                                        })
                                                        .catch(err => console.log(err));
                                                }}>Like Post</button>
                                            }

                                            <button onClick={(e) => {
                                                if (commentFormPopulate === false) {
                                                    setCommentFormPopulate(true);
                                                    setCommentIndexForCommentFormPopulate(index);
                                                } else {
                                                    setCommentFormPopulate(false);
                                                    setCommentIndexForCommentFormPopulate(null);
                                                }
                                            }}>Comment</button>
                                        </>
                                }
                                </div>
                            )
                        })
                    }
                </div>
            </main>
        </>
        </div>
    );
    
}
export default ProfilePage;