import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Mock components and icons
const TextType = ({ as: Component = 'h1', text, ...props }) => <Component {...props}>{text}</Component>;
const EyeIcon = (props) => <svg {...props} />;
const EyeOffIcon = (props) => <svg {...props} />;

function SignIn() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [role, setRole] = useState('student');

    const handleSignIn = async (event) => {
        event.preventDefault();
        setError('');

        if (!role) {
            setError('Please select a role.');
            return;
        }

        const endpoint = role === 'student' ? '/api/students/login' : '/api/teachers/login';
        const credentials = { email, password };

        // --- DEBUGGING LOG ---
        // This will show us exactly what is being sent in the browser console.
        console.log(`[Frontend] Attempting to log in to ${endpoint} with credentials:`, credentials);
        // --- END DEBUGGING LOG ---

        try {
            const response = await axios.post(endpoint, credentials);
            const { token, user } = response.data;

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(user));
                console.log('[Frontend] Login successful. Token and userInfo stored.');
                navigate('/dashboard');
            } else {
                setError('Login successful, but critical data was missing.');
            }
        } catch (err) {
            console.error('[Frontend] Sign-in failed:', err);
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    // --- No changes to the rest of the component's JSX or helper functions ---
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const ValidationItem = ({ isValid, text }) => (
        <li className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-gray-400'}`}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" /></svg>
            {text}
        </li>
    );
    const hasEightChars = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    return (
        <div className='flex min-h-screen font-sans bg-white text-gray-900 '>
            <div className='w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16'>
                <div className='w-full max-w-md mx-auto'>
                    <TextType as="h1" className="text-3xl font-bold mb-2 h-10 leading-tight" text="Welcome to the Portal" />
                    <form onSubmit={handleSignIn}>
                        {/* Role, Email, Password inputs, etc. */}
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                            <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' placeholder='Email' />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                            <div className="relative">
                                <input type={passwordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"><EyeIcon /></button>
                            </div>
                        </div>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs mb-6">
                             <ValidationItem isValid={hasEightChars} text="Use 8 or more characters" />
                             <ValidationItem isValid={hasUpperCase} text="One Uppercase character" />
                             <ValidationItem isValid={hasLowerCase} text="One lowercase character" />
                             <ValidationItem isValid={hasSpecialChar} text="One special character" />
                             <ValidationItem isValid={hasNumber} text="One number" />
                        </ul>
                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                        <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">Sign In</button>
                        <p className="text-center text-gray-600 mt-6">Don't have an account?{' '}<Link to="/signup" className='text-blue-600 font-semibold underline hover:text-blue-800 transition-colors'>Sign Up</Link></p>
                    </form>
                </div>
            </div>
            <div className="hidden md:flex w-1/2 bg-gray-900 bg-cover bg-center" style={{ backgroundImage: "url('https://images.hdqwalls.com/wallpapers/minimalistic-dark-3d-di.jpg')" }} />
        </div>
    );
}

export default SignIn;

