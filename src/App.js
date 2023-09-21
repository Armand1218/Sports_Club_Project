import {BrowserRouter,Routes, Route} from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import ProfilePage from './Components/ProfilePage';
import EditProfile from './Components/EditProfile';
import Feed from './Components/Feed';
import "./App.css"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/profilePage' element={<ProfilePage />} ></Route>
          <Route path='/editProfile' element={<EditProfile />}></Route>
          <Route path='/feed' element={<Feed />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
