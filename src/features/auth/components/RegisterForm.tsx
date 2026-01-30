import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout';
import { DarkInput, Button } from '../../../components/ui';
import { AUTH_TEXT } from '../constants';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', { username, email, password });

    // After successful registration, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title={AUTH_TEXT.REGISTER.TITLE}
      subtitle={AUTH_TEXT.REGISTER.SUBTITLE}
      variant="dark"
      showLogoInCard={true}
      copyright={AUTH_TEXT.COMMON.COPYRIGHT}
      footer={
        <p className="text-slate-400 text-sm">
          {AUTH_TEXT.REGISTER.FOOTER_TEXT}{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors bg-transparent border-none cursor-pointer"
          >
            {AUTH_TEXT.REGISTER.FOOTER_LINK}
          </button>
        </p>
      }
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <DarkInput
          label={AUTH_TEXT.REGISTER.USERNAME_LABEL}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={AUTH_TEXT.REGISTER.USERNAME_PLACEHOLDER}
          leftIcon="person"
          autoComplete="off"
        />

        <DarkInput
          label={AUTH_TEXT.REGISTER.EMAIL_LABEL}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={AUTH_TEXT.REGISTER.EMAIL_PLACEHOLDER}
          leftIcon="mail"
        />

        <DarkInput
          label={AUTH_TEXT.REGISTER.PASSWORD_LABEL}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={AUTH_TEXT.REGISTER.PASSWORD_PLACEHOLDER}
          leftIcon="lock"
          rightIcon={showPassword ? 'visibility_off' : 'visibility'}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        <Button
          type="submit"
          className="mt-2 rounded-xl shadow-lg shadow-blue-500/25 h-12"
        >
          {AUTH_TEXT.REGISTER.SUBMIT_BUTTON}
        </Button>
      </form>
    </AuthLayout>
  );
};