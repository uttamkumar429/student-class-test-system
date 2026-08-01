import api from "./api";

const PROFILE_BASE_URL = "/profile";

const studentProfileService = {
async getProfile() {
  console.log("🚀 Calling GET /profile");

  try {
    const response = await api.get(PROFILE_BASE_URL);

    console.log("✅ Full Axios Response:", response);
    console.log("✅ Response Data:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
},
  async updateProfile(profileData) {
    const response = await api.put(
      PROFILE_BASE_URL,
      profileData
    );

    return response.data.data;
  },

  async uploadProfilePhoto(formData) {
    const response = await api.patch(
      `${PROFILE_BASE_URL}/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },
};


export default studentProfileService;