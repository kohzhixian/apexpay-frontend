import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../../components/layout';
import { DarkInput, Button, Alert, Checkbox } from '../../../components/ui';
import { AUTH_TEXT } from '../constants';
import { loginSchema, type LoginFormData } from '../../../schemas';
import { useLoginMutation } from '../services/authApi';

/**
 * Extracts a user-friendly error message from RTK Query error
 * @param error - The error object from RTK Query mutation
 * @returns A user-friendly error title and message
 */
const getErrorMessage = (error: unknown): { title: string; message: string } => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;

    // Handle plain string response (e.g., "The User Service is currently taking too long...")
    if (typeof data === 'string' && data.length > 0) {
      const isServiceError = data.toLowerCase().includes('service') ||
        data.toLowerCase().includes('down') ||
        data.toLowerCase().includes('unavailable') ||
        data.toLowerCase().includes('taking too long');

      return {
        title: isServiceError ? AUTH_TEXT.LOGIN.SERVICE_UNAVAILABLE_TITLE : AUTH_TEXT.LOGIN.LOGIN_FAILED_TITLE,
        message: data,
      };
    }

    // Handle JSON response with message property
    if (data && typeof data === 'object' && 'message' in data) {
      const apiMessage = (data as { message: string }).message;
      const isServiceError = apiMessage.toLowerCase().includes('service') ||
        apiMessage.toLowerCase().includes('down') ||
        apiMessage.toLowerCase().includes('unavailable') ||
        apiMessage.toLowerCase().includes('taking too long');

      return {
        title: isServiceError ? AUTH_TEXT.LOGIN.SERVICE_UNAVAILABLE_TITLE : AUTH_TEXT.LOGIN.LOGIN_FAILED_TITLE,
        message: apiMessage,
      };
    }
  }

  // Fallback to default credentials error
  return {
    title: AUTH_TEXT.LOGIN.ERROR_TITLE,
    message: AUTH_TEXT.LOGIN.ERROR_MESSAGE,
  };
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const errorInfo = error ? getErrorMessage(error) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password }).unwrap();
      reset();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
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
        {errorInfo && (
          <Alert
            variant="error"
            title={errorInfo.title}
            message={errorInfo.message}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DarkInput
            label={AUTH_TEXT.LOGIN.EMAIL_LABEL}
            type="email"
            placeholder={AUTH_TEXT.LOGIN.EMAIL_PLACEHOLDER}
            leftIcon="mail"
            error={errors.email?.message}
            {...register('email')}
          />

          <DarkInput
            label={AUTH_TEXT.LOGIN.PASSWORD_LABEL}
            type={showPassword ? 'text' : 'password'}
            placeholder={AUTH_TEXT.LOGIN.PASSWORD_PLACEHOLDER}
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility_off' : 'visibility'}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-1">
            <Checkbox
              label={AUTH_TEXT.LOGIN.REMEMBER_ME}
              variant="dark"
              {...register('rememberMe')}
            />
            <button
              type="button"
              onClick={() => {/* Handle forgot password */ }}
              className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
            >
              {AUTH_TEXT.LOGIN.FORGOT_PASSWORD}
            </button>
          </div>

          <Button type="submit" disabled={isLoading} leftIcon="login" className="mt-2 rounded-xl shadow-lg shadow-blue-500/25 h-12">
            {isLoading ? AUTH_TEXT.LOGIN.LOADING_BUTTON : AUTH_TEXT.LOGIN.SUBMIT_BUTTON}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
