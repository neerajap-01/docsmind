type UserPayload = {
  email: string;
  name: string;
  password: string;
}

type UserLoginPayload = {
  email: string;
  password: string;
}

type ForgotPasswordReqPayload = {
  email: string;
}

type ResetPasswordPayload = {
  password: string;
}