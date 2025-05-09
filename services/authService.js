import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "x-dashboard-type": "restaurant",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgotpassword", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.put(`/api/auth/resetpassword/${resetToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (details) => {
  try {
    const response = await api.put("/api/auth/updatedetails", details);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/api/auth/updatepassword", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
