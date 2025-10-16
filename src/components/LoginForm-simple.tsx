import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginFormSimple() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo login - accept any non-empty credentials
    if (email.trim() && password.trim()) {
      // Store simple session
      if (typeof window !== 'undefined') {
        localStorage.setItem('chabs_user', JSON.stringify({ email, role: 'admin' }));
      }
      router.push('/dashboard');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
            type="email"
            placeholder="Enter your email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium" type="submit">
        Sign In
      </button>
      
      <div className="text-center text-sm text-gray-500">
        <p className="mb-2">Demo System - Use any credentials:</p>
        <p className="text-xs">
          📧 Email: admin@chabs.com<br/>
          🔑 Password: admin123
        </p>
      </div>
    </form>
  );
}