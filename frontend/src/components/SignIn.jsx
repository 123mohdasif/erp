import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import axios from 'axios';


// Mock TextType component since the original is not available.
const TextType = ({ as: Component = 'h1', text, ...props }) => {
    return <Component {...props}>{Array.isArray(text) ? text[0] : text}</Component>;
};



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

function SignIn() {
    const navigate = useNavigate();
    const [error, setError] = useState(''); // State to hold error messages

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [role, setRole] = useState('student'); // Default role is 'student'

    const hasEightChars = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    const handleSignIn = async (event) => {
        event.preventDefault();
        setError('');

        if (!role) {
            setError('Please select a role.');
            return;
        }

        // Determine the correct API endpoint based on the selected role
        const endpoint = role === 'student' 
            ? 'http://localhost:5000/api/students/login' 
            : 'http://localhost:5000/api/teachers/login';

        try {
            const response = await axios.post(endpoint, {
                email,
                password,
            });

            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role); // Store the role as well
                console.log('Token and role stored successfully!');
                navigate('/dashboard');
            } else {
                setError('Login successful, but no token received.');
            }
        } catch (err) {
            console.error('Sign-in failed:', err);
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const ValidationItem = ({ isValid, text }) => (
        <li className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-gray-400'}`}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
            {text}
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
                            text={["Welcome to the Portal", "Sign In to Your Account", "Access Your Dashboard"]}
                            textColors={['#111827']}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                            loop={true}
                        />

                        <form onSubmit={handleSignIn}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input
                                    type="text"
                                    id='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    placeholder='Email'
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                        aria-label="Toggle password visibility"
                                    >
                                        {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
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

                            {error && (
                                <div className="text-red-500 text-sm mb-4">{error}</div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                            >
                                Sign In
                            </button>

                            <p className="text-center text-gray-600 mt-6">
                                Don't have an account?{' '}
                                <Link to="/signup" className='text-blue-600 font-semibold underline hover:text-blue-800 transition-colors'>
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                <div
                    className="hidden md:flex w-1/2 bg-gray-900 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.hdqwalls.com/wallpapers/minimalistic-dark-3d-di.jpg')" }}
                >
                </div>
            </div>
        </>);
}

export default SignIn;
