import { Routes, Route } from 'react-router-dom';

import Dashboard from './components/DashBoard.jsx';
import FuzzyText from './animations/FuzzyText.jsx';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/' element={<SignUp />} />
      <Route path='/dashboard' element={<Dashboard />} />
      
      {/* Catch-all 404 Route */}
      <Route
        path='*'
        element={
          // This wrapper div centers the 404 message on the screen
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'sans-serif',
          }}>
            <div style={{ fontSize: '6rem', fontWeight: 'bold' }}>
              <FuzzyText 
                baseIntensity={0.1} 
                hoverIntensity={0.4} 
                enableHover={true}
              >
                404
              </FuzzyText>
            </div>
            <p style={{ fontSize: '1.5rem', color: '#555' }}>Page Not Found</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

