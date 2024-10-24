import './App.css';
import { Route, Routes } from 'react-router-dom';

import RequireAuth from './components/Auth/RequireAuth';
import AboutUs from './Pages/AboutUs';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import Checkout from './Pages/Payment/Checkout';
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess';
import Signup from './Pages/Signup';
import CourseList from './Pages/Course/CourseList';
import Contact from './Pages/Contact';
import Denied from './Pages/Denied';
import CreateCourse from './Pages/Course/CreateCourse';
import CourseDescription from './Pages/Course/CourseDescription';
import Profile from './Pages/User/Profile';
import EditProfile from './Pages/User/EditProfile';
import CheckoutFailure from './Pages/Payment/CheckoutFailure';
import Displaylectures from './Pages/Dashboard/Displaylectures';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import AddLecture from './Pages/Dashboard/Addlecture';
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} ></Route>
        <Route path="/about" element={<AboutUs />} ></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/description" element={<CourseDescription />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="contact" element={<Contact />} />
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/course/displaylectures' element={<Displaylectures />}/>
        <Route path='/checkout/success' element={<CheckoutSuccess />} />
        <Route path='/user/editprofile' element={<EditProfile />} />
        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER"]} />}>
        <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path='/user/profile' element={<Profile />} />
        </Route>
        <Route path='/checkout/fail' element={<CheckoutFailure />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}
export default App