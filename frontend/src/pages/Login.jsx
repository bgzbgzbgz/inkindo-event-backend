import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });

      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('authUser', JSON.stringify(user));
        window.sessionStorage.setItem('inkindo-auth-role', user.role);
        
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard-user');
        }
      } else {
        alert(response.data.message || "Email atau Password salah!");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Email atau Password salah!");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;