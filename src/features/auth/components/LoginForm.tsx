import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout';
import { DarkInput, Button, Alert, Checkbox } from '../../../components/ui';
import { AUTH_TEXT } from '../constants';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password, rememberMe });

    // For now, redirect to dashboard (replace with actual auth logic later)
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title={AUTH_TEXT.LOGIN.TITLE}
      subtitle={AUTH_TEXT.LOGIN.SUBTITLE}
      variant="dark"
      showLogoInCard={true}
      copyright={AUTH_TEXT.COMMON.COPYRIGHT}
      footer={
        <p className="text-slate-400 text-sm">
          {AUTH_TEXT.LOGIN.FOOTER_TEXT}{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors bg-transparent border-none cursor-pointer"
          >
            {AUTH_TEXT.LOGIN.FOOTER_LINK}
          </button>
        </p>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Error State */}
        {showError && (
          <Alert
            variant="error"
            title={AUTH_TEXT.LOGIN.ERROR_TITLE}
            message={AUTH_TEXT.LOGIN.ERROR_MESSAGE}
            onDismiss={() => setShowError(false)}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DarkInput
            label={AUTH_TEXT.LOGIN.EMAIL_LABEL}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={AUTH_TEXT.LOGIN.EMAIL_PLACEHOLDER}
            leftIcon="mail"
          />

          <DarkInput
            label={AUTH_TEXT.LOGIN.PASSWORD_LABEL}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={AUTH_TEXT.LOGIN.PASSWORD_PLACEHOLDER}
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility_off' : 'visibility'}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-1">
            <Checkbox
              label={AUTH_TEXT.LOGIN.REMEMBER_ME}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              variant="dark"
            />
            <button
              type="button"
              onClick={() => {/* Handle forgot password */ }}
              className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
            >
              {AUTH_TEXT.LOGIN.FORGOT_PASSWORD}
            </button>
          </div>

          <Button type="submit" leftIcon="login" className="mt-2 rounded-xl shadow-lg shadow-blue-500/25 h-12">
            {AUTH_TEXT.LOGIN.SUBMIT_BUTTON}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
