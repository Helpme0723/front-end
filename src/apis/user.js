import axiosInstance from './axiosInstance';

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/api/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updateUserInfo = async (formData) => {
  try {
    const response = await axiosInstance.patch("/api/users/me", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const updateUserPassword = async (updateUserPasswordDto) => {
  try {
    const response = await axiosInstance.patch("/api/users/me/password", updateUserPasswordDto);
    return response.data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
