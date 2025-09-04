import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import axios from 'axios';


import TextType from '../animations/TextType.jsx';



const EyeIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} // Dynamic width
    height={size} // Dynamic height
    viewBox="0 0 24 24" // The coordinate system for the SVG content.
    fill="none" // No color fill for the shapes.
    stroke="currentColor" // The stroke color will be the same as the parent's text color.
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props} // Spreads any other passed-in props (like className) onto the SVG element.
  >
    {/* SVG paths that draw the shape of the eye. */}
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// SVG Icon for a crossed-out eye, used to hide the password.
const EyeOffIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* SVG paths and line that draw the shape of the crossed-out eye. */}
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

function SignUp() {
  const [login, successLogin] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(''); // State to hold error messages

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const hasEightChars = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password); // Checks for at least one uppercase letter.
  const hasLowerCase = /[a-z]/.test(password); // Checks for at least one lowercase letter.
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Checks for a special character.
  const hasNumber = /\d/.test(password); // Checks for at least one number.


const handleSubmit = async (event) => {
    // 3. Prevent the default page reload
    event.preventDefault();
    setError(''); // Clear previous errors

    // 4. Wrap the API call in a try...catch block for error handling
    try {
      const res = await axios.post('http://localhost:5000/api/students/register', {
        name,
        email,
        password,
        rollNumber,
        className
      });
      console.log('Registration Successful:', res.data);
      // Redirect to the sign-in page after a successful registration
      navigate('/signin');
    } catch (err) {
      console.error('Registration Failed:', err);
      // Set an error message to display to the user
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };


  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const ValidationItem = ({ isValid, text }) => (
    // The text color changes based on the 'isValid' prop. Green for valid, gray for invalid.
    <li className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-gray-400'}`}>
      {/* A checkmark icon is displayed next to the text. */}
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
      </svg>
      {text} {/* The validation rule text. */}
    </li>
  );







  return (
    <>
      <div className='flex min-h-screen font-sans bg-white text-gray-900 '>
        <div className='w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16'>
          <div className='w-full max-w-md mx-auto'>


            <TextType
              as="h1"
              className="text-3xl font-bold mb-2 h-10 leading-tight"
              text={["Welcome to the Student Portal", "Create Your Account", "Join Us Today!"]}
              textColors={['#111827']}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              loop={true}
            />



            <p className="text-gray-600 mb-8">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>

            <form action="">



              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="className">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name} // Binds the value to the 'className' state.
                    onChange={(e) => setName(e.target.value)} // Updates the 'className' state on change.
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    
                  />
                </div>

              <div className='mb-4'>

                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>

                <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' placeholder='Email' />
              </div>


              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rollNumber">
                  Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber} // Binds the value to the 'rollNumber' state.
                  onChange={(e) => setRollNumber(e.target.value)} // Updates the 'rollNumber' state on change.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 101"
                />


                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="className">
                    Class
                  </label>
                  <input
                    type="text"
                    id="className"
                    value={className} // Binds the value to the 'className' state.
                    onChange={(e) => setClassName(e.target.value)} // Updates the 'className' state on change.
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g., Grade 10"
                  />
                </div>







                {/* Password Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative"> {/* 'relative' positioning is needed for the absolute-positioned button inside. */}
                    <input
                      type={passwordVisible ? 'text' : 'password'} // Dynamically change the input type based on state.
                      id="password"
                      value={password} // Binds the value to the 'password' state.
                      onChange={(e) => setPassword(e.target.value)} // Updates the 'password' state on change.
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    {/* Button to toggle password visibility */}
                    <button
                      type="button" // Important to prevent form submission.
                      onClick={togglePasswordVisibility} // Calls our toggle function when clicked.
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label="Toggle password visibility"
                    >
                      {/* Conditionally render the correct eye icon based on the 'passwordVisible' state. */}
                      {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      <span className="ml-2 text-sm">Hide</span>
                    </button>
                  </div>
                </div>



                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs mb-6">
                  <ValidationItem isValid={hasEightChars} text="Use 8 or more characters" />
                  <ValidationItem isValid={hasUpperCase} text="One Uppercase character" />
                  <ValidationItem isValid={hasLowerCase} text="One lowercase character" />
                  <ValidationItem isValid={hasSpecialChar} text="One special character" />
                  <ValidationItem isValid={hasNumber} text="One number" />
                </ul>





              </div>


              <button
                type="submit" // This button will submit the form when clicked.
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                onClick={handleSubmit}
              >
                Create an account
              </button>

              {/* Alternative log in link at the bottom */}
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                
                <Link to="/signin" className='text-blue-600 font-semibold underline hover:text-blue-800 transition-colors' >
                  Login
                </Link>
              </p>


            </form>




          </div>

        </div>

        <div
          className="hidden md:flex w-1/2 bg-gray-900 bg-cover bg-center"
          // An inline style is used to set the background image.
          // You should replace the placeholder URL with the actual URL of your image.
          style={{ backgroundImage: "url('https://images.hdqwalls.com/wallpapers/minimalistic-dark-3d-di.jpg')" }}
        >
          {/* This div is now intentionally empty. The image is its background. */}
        </div>
      </div>




    </>
  )
}

export default SignUp
