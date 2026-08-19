import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProfile,
  updateProfile,
} from "../../redux/studentProfile/profileThunk";

import {
  resetProfileSuccess,
  clearProfileError,
} from "../../redux/studentProfile/profileSlice";

import ProfileCard from "../../components/students/profile/ProfileCard";
import EditProfileModal from "../../components/students/profile/EditProfileModal";

function ProfilePage() {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {
        profile,
        loadingProfile,
        loadingUpdate,
        success,
        // error,
    } = useSelector((state) => state.studentProfile);

    useEffect(() => {

    dispatch(fetchProfile());
    }, [dispatch]);
    useEffect(() => {
        if (success) {
            dispatch(resetProfileSuccess());
            dispatch(fetchProfile());
        }
    }, [success, dispatch]);

    const openEditModal = () => {
     setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
      setIsEditModalOpen(false);

      dispatch(clearProfileError());
    };

    const handleUpdateProfile = async (formData) => {
      try {
        await dispatch(updateProfile(formData)).unwrap();

        setIsEditModalOpen(false);

        dispatch(fetchProfile());
    } catch (error) {
        console.error(error);
    }
    };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <ProfileCard
            profile={profile}
            onEdit={openEditModal}
        />

        <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            profile={profile}
            loading={loadingUpdate}
            onSave={handleUpdateProfile}
        />

      </div>
    </div>
  );
}

export default ProfilePage;