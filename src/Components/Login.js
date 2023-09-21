import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const submitForm = (e) => {
        //if your computer is slower this may take a while becauase of the profile picture
        e.preventDefault();
        axios.post("http://localhost:8000/api/user/login",{email: email,password: password}, {withCredentials: true})
            .then(res => {
                navigate('/profilePage')})
            .catch(err => { 
                setEmailError((err.response.data.email === undefined ? null : err.response.data.email));
                setPasswordError((err.response.data.password === undefined ? null : err.response.data.password));
            });
    }
    const errStyles = {
        color: "red"
    }

    return (
        <div className='login-container'>
        <>  
            <div className='login-header'>
            <header>
                <h1>Sports Club</h1>
            </header>
            </div>
            <main>
                <div className='login-form'>
                <form onSubmit={submitForm}>
                    <p style={errStyles}>{emailError}</p>
                    <label className='form-label'>Email:</label>
                    <input className='form-control' type='text'  value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <p style={errStyles}>{passwordError}</p>
                    <label className='form-label'>Password:</label>
                    <input className='form-control' type='password'  value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <div className='login-button'>
                    <button className='login-button'>Login</button>
                    </div>
                </form>
                </div>
            </main>

            <footer>
                <p>Don't Have an account?</p>
                <p><a className='login-link' href='/'>Create an account here</a></p>
            </footer>
        </>
        </div>
    );
}

export default Login;