import { AUTHROUTESBFF, SERVER_BFF } from "@/contants/bffEndpoints.contants";
import { fetchData } from "@/utils/fetchData";


export const registerUserBFF = async (payload: UserPayload) => {
  try {
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.register(),
      'post',
      payload
    );
    if (response.error !== 0) {
      throw new Error('Failed to register user');
    }
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error registering user");
  }
};

export const verifyEmailBFF = async (token: string, signal: AbortSignal) => {
  try {
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.verifyEmail(),
      'get',
      {},
      { token },
      {},
      false,
      false,
      signal
    );

    if (response.error !== 0) {
      throw new Error('Failed to verify email');
    }
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error verifying email");
  }
};

export const loginUserBFF = async (payload: UserLoginPayload) => {
  try {
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.login(),
      'post',
      payload
    );
    if (response.error !== 0) {
      throw new Error('Failed to login user');
    }
    if(response.data?.token) {
      // Set the token in cookies for 7 days
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `auth_token=${response.data.token}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
    }
    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error logging in user");
  }
};

export const logoutUserBFF = async () => {
  try {
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.logout(),
      'get',
    );
    if (!response.ok) {
      throw new Error('Failed to logout user');
    }
    return response;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error logging out user");
  }
};

export const forgotPasswordReqBFF = async (payload: ForgotPasswordReqPayload) => {
  try {
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.forgotPassword(),
      'post',
      payload
    );
    if (!response.ok) {
      throw new Error('Failed to send password reset email');
    }
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error sending password reset email");
  }
};

export const resetPasswordBFF = async (payload: ResetPasswordPayload) => {
  try {
    // Fetch the token from the cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    const response = await fetchData(
      SERVER_BFF,
      AUTHROUTESBFF.resetPassword(),
      'post',
      payload,
      { token: token || '' } // Pass the token in the headers,
    );
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error resetting password");
  }
};