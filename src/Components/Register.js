import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Register = () => {

    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [bio, setBio] = useState("");
    const [bioError, setBioError] = useState("");
    const [city, setCity] = useState("");
    const [cityError, setCityError] = useState("");
    const [state, setState] = useState("");
    const [stateError, setStateError] = useState("");
    const [sport, setSport] = useState("");
    const [sportError, setSportError] = useState("");
    const [sportTeam, setSportTeam] = useState("");
    const [sportTeamError, setSportTeamError] = useState("");
    const [birthday, setBirthday] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [gender, setGender] = useState("");
    const [genderError, setGenderError] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoError, setPhotoError] = useState("");
    const [base64string, setBase64String] = useState(undefined);

    const navigate = useNavigate();

    const submitForm = (e) => {
        //if your computer is slower this may take a while becauase of the profile picture
        e.preventDefault();
        axios.post('http://localhost:8000/api/user/register', {
            fullName: fullName, email: email,password: password, confirmPassword: confirmPassword
            ,bio: bio, city: city, state: state ,sport: sport, sportTeam: sportTeam, birthDate: birthday, gender: gender,
            photo: base64string},
            {withCredentials: true})
            .then(res => {
                navigate('/profilePage');
            })
            .catch(err => {
                console.log(err);
                const er = err.response.data.err.errors;
                setFullNameError((er.fullName === undefined ? null : er.fullName.message));
                setBioError((er.bio === undefined ? null : er.bio.message));
                setCityError((er.city === undefined ? null : er.city.message));
                setStateError((er.state === undefined ? null : er.state.message));
                setSportError((er.sport === undefined ? null : er.sport.message));
                setSportTeamError((er.sportTeam === undefined ? null : er.sportTeam.message));
                setBirthdayError((er.birthDate === undefined ? null : er.birthDate.message));
                setGenderError((gender !== "" ? null : "Please provide your gender"));
                setPhotoError((base64string !== undefined ? null : er.photo.message));
                setEmailError((er.email === undefined ? null : er.email.message));
                setPasswordError((er.password === undefined ? null : er.password.message));
                setConfirmPasswordError((er.confirmPassword === undefined ? null : er.confirmPassword.message));
                console.log(err.response.data.err.errors);
            })

    }

    const photoHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64String(reader.result.toString());
            setPhoto(base64string);
        }
        
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    const errStyles = {
        color: "red"
    }

    return (
        <div className='register-container'>
        <>  
            <div className='register-header'>
            <header>
                <h1 className='register-header-words'>Sports Club</h1>
            </header>
            </div>
            <main>
            <div className='register-form'>
                <form onSubmit={submitForm}>

                    <p style={errStyles}>{fullNameError}</p>
                    <label className='form-label'>Full Name: </label>
                    <input className='form-control' type='text' value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                    <p style={errStyles}>{bioError}</p>
                    <label className='form-label'>Bio: </label>
                    <input className='form-control' type="text" onChange={(e) => setBio(e.target.value)}></input>
                    <p style={errStyles}>{cityError}</p>
                    <label className='form-label'>Current City: </label>
                    <input className='form-control' type="text" onChange={(e) => setCity(e.target.value)}></input>
                    <p style={errStyles}>{stateError}</p>
                    <label className='form-label'>Current State: </label>
                    <input className='form-control' type="text" onChange={(e) => setState(e.target.value)}></input>
                    <p style={errStyles}>{sportError}</p>
                    <label className='form-label'>Sport: </label>
                    <input className='form-control' type="text" onChange={(e) => setSport(e.target.value)}></input>
                    <p style={errStyles}>{sportTeamError}</p>
                    <label className='form-label'>Favorite Sports Team: </label>
                    <input className='form-control' type="text" onChange={(e) => setSportTeam(e.target.value)}></input>
                    <p style={errStyles}>{birthdayError}</p>
                    <label className='form-label'>Birthday: </label>
                    <input className='form-control' type="input" onChange={(e) => setBirthday(e.target.value)}></input>
                    <p style={errStyles}>{genderError}</p>
                    <label className='form-label'>Gender:</label>
                    <select onChange={(e) => setGender(e.target.value)}>
                        <option default></option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>other</option>
                    </select>
                    <p style={errStyles}>{photoError}</p>
                    <label className='form-label'>Profile picture: </label>
                    <input className='form-control' type='file' onChange={photoHandler}></input>
                    <p style={errStyles}>{emailError}</p>
                    <label className='form-label'>Email:</label>
                    <input className='form-control' type='text'  value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <p style={errStyles}>{passwordError}</p>
                    <label className='form-label'>Password:</label>
                    <input className='form-control' type='password'  value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <p style={errStyles}>{confirmPasswordError}</p>
                    <label className='form-label'>Confirm Password:</label>
                    <input className='form-control' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    
                    <p></p>
                    <button>Sign Up!</button>

                </form>
                </div>
                <p><a href="/login">Already have an account? Login here.</a></p>
            </main>
        </>
        </div>
    );
    

}
export default Register;