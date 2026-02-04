import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../../components/layout';
import { DarkInput, Button, Alert } from '../../../components/ui';
import { AUTH_TEXT } from '../constants';
import { registerSchema, type RegisterFormData } from '../../../schemas';
import { useRegisterMutation } from '../services/authApi';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap();
      reset();
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
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
      <div className="flex flex-col gap-4">
        {/* Error State */}
        {error && (
          <Alert
            variant="error"
            title={AUTH_TEXT.REGISTER.ERROR_TITLE}
            message={'message' in error ? (error as { message: string }).message : AUTH_TEXT.REGISTER.ERROR_MESSAGE}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DarkInput
            label={AUTH_TEXT.REGISTER.USERNAME_LABEL}
            type="text"
            placeholder={AUTH_TEXT.REGISTER.USERNAME_PLACEHOLDER}
            leftIcon="person"
            autoComplete="off"
            error={errors.username?.message}
            {...register('username')}
          />

          <DarkInput
            label={AUTH_TEXT.REGISTER.EMAIL_LABEL}
            type="email"
            placeholder={AUTH_TEXT.REGISTER.EMAIL_PLACEHOLDER}
            leftIcon="mail"
            error={errors.email?.message}
            {...register('email')}
          />

          <DarkInput
            label={AUTH_TEXT.REGISTER.PASSWORD_LABEL}
            type={showPassword ? 'text' : 'password'}
            placeholder={AUTH_TEXT.REGISTER.PASSWORD_PLACEHOLDER}
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility_off' : 'visibility'}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-xl shadow-lg shadow-blue-500/25 h-12"
          >
            {isLoading ? AUTH_TEXT.REGISTER.LOADING_BUTTON : AUTH_TEXT.REGISTER.SUBMIT_BUTTON}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
