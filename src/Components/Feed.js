import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Feed = () => {

    //The sports api only runs 100 requests a day per type so (100 nba, 100 nfl, and 100 mlb), so when refreshing the page be mindful that you only have 100 requests 
    //

    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [fullName, setFullName] = useState("");

    const logOutButton = (e) => {
        e.preventDefault();
        navigate('/');
    }
    //grabs user
    useEffect(() => {
        axios.get('http://localhost:8000/api/user/getlogged', {withCredentials: true})
            .then(res => { 
                setFullName(res.data.fullName);
            })
            .catch(err => { 
                console.log(err)
            });
    }, [count])

    const [posts, setPosts] = useState([]);
    //grabs posts
    useEffect(() => {
        axios.get('http://localhost:8000/api/grabAllPosts', {withCredentials: true})
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.log(err));
    }, [count])

    const [commentMessage, setCommentMessage] = useState("");
    const [commentFormPopulate, setCommentFormPopulate] = useState(false);
    const [commentIndexForCommentFormPopulate, setCommentIndexForCommentFormPopulate] = useState(null);
    
    const [userRequestForLiveScores, setUserRequestForLiveScores] = useState(null);
    const [liveScoresDisplay, setLiveScoresDisplay] = useState(null);

    const [todaysDate, setTodaysDate] = useState(new Date());
    const [todaysDateFormatForExternalApi, setTodaysDateFormatForExternalApi] = useState(() => {

        if (todaysDate.getMonth().toString().length == 1) {
            return todaysDate.getFullYear() +"-0" +( todaysDate.getMonth() + 1 ) + "-" + todaysDate.getDate();
        }
        else {
            return todaysDate.getFullYear() +( todaysDate.getMonth() + 1 ) + "-" + todaysDate.getDate();
        }
    
    });
    //liveScoreDisplayController
    useEffect(() => {        
        if (userRequestForLiveScores === null) {
            setLiveScoresDisplay(null);
        } else if (userRequestForLiveScores === "NBA") {
            axios.get("https://v2.nba.api-sports.io/games?date="+todaysDateFormatForExternalApi,
            {headers: {'x-rapidapi-key': '7292529224de8554a6bd9f9ba3831d88','x-rapidapi-host': 'v2.nba.api-sports.io'}})
                .then(res => {
                    console.log(todaysDateFormatForExternalApi);
                    setLiveScoresDisplay(res.data.response.map((game, index) => {
                        
                        return (
                            <div key={index} style={{border: "2px solid black", margin: "5px"}}>
                                <p>{game.teams.home.name} : {game.scores.home.points === null ? 0 : game.scores.home.points}</p>
                                <p>{game.teams.visitors.name} : {game.scores.visitors.points === null ? 0 : game.scores.visitors.points}</p>
                            </div>
                        );
                        
                    }));
                })
                .catch(err => console.log(err));
        } else if (userRequestForLiveScores === "MLB") {
            axios.get("https://v1.baseball.api-sports.io/games?date="+todaysDateFormatForExternalApi,
            {headers: {'x-rapidapi-key': '7292529224de8554a6bd9f9ba3831d88','x-rapidapi-host': 'v1.baseball.api-sports.io'}})
                .then(res => {
                    setLiveScoresDisplay(res.data.response.map((game, index) => {
                        return (
                            <div key={index} style={{border: "2px solid black", margin: "5px"}}>
                                <p>{game.teams.home.name} : {game.scores.home.total === null ? 0 : game.scores.home.total}</p>
                                <p>{game.teams.away.name} : {game.scores.away.total === null ? 0 : game.scores.home.total}</p>
                            </div>
                        );
                    }))
                })
                .catch(err => console.log(err));
            
        } else if (userRequestForLiveScores === "NFL") {
            axios.get("https://v1.american-football.api-sports.io/games?date="+todaysDateFormatForExternalApi,
            {headers: {'x-rapidapi-key': '7292529224de8554a6bd9f9ba3831d88','x-rapidapi-host': 'v1.american-football.api-sports.io'}})
                .then(res => {
                    setLiveScoresDisplay(() => {
                        if (res.data.response.length === 0) {
                            return (
                                <div>
                                    <p>Season hasn't started yet!</p>
                                </div>
                            );
                        }
                    });
                })
                .catch(err => console.log(err));
        }

    }, [count]);

    //Timeout method used to make the scores live, making the page update every minute (the exteranl api only allows 100 requests a day thats why this is commented out)
    /*
    useEffect(() => {
        setTimeout(() => {
            setCount(count => count + 1);
        }, 60000)
    }) */
    

    const grabSport = (e) => {
        e.preventDefault();
        //baseball
            axios.get(
                "https://v1.baseball.api-sports.io/games?date=2023-05-19&league=1&season=2023"
                ,
            {headers: {
                'x-rapidapi-key': '7292529224de8554a6bd9f9ba3831d88',
                'x-rapidapi-host': 'v1.baseball.api-sports.io'
            }})
            .then(res => {
                

            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return(
        <div className='feed-container'>
        <>
            <nav>
                <h2>Sports Club</h2>
                <button onClick={logOutButton}>Logout</button>
                <button onClick={(e) => navigate('/profilePage')}>Profile Page</button>
            </nav>
            <div className='scores-box'>
            <header className='Live-Scores'>
                <p><b>Live Scores</b></p>

                <button onClick={(e) => { setUserRequestForLiveScores("NBA"); setCount(count => count + 1); }}>NBA</button>
                <button onClick={(e) => { setUserRequestForLiveScores("MLB"); setCount(count => count + 1);}}>MLB</button>
                <button onClick={(e) => { setUserRequestForLiveScores("NFL"); setCount(count => count + 1);}}>NFL</button>
                <button onClick={(e) => { setUserRequestForLiveScores(null); setCount(count => count + 1);}}>Hide Scores</button>
                {liveScoresDisplay}
            </header>
            </div>

            <main>
                <h4>Your Sports Feed</h4>
                <div className='Posts'> 
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
export default Feed;