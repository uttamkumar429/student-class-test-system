import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { uploadProfilePhoto } from "../../../redux/studentProfile/profileThunk";
import defaultAvatar from "../../../assets/images/default-avatar.png";
function ProfilePhotoUploader({ profile }) {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const { loadingPhotoUpload } = useSelector(
    (state) => state.studentProfile
  );

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profilePhoto", file);

    dispatch(uploadProfilePhoto(formData));
  };

  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-6">

    <img
    src={profile.profilePhoto || defaultAvatar}
    alt={profile.fullName}
    className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-md"
    />

      <h2 className="mt-5 text-xl font-semibold text-gray-900">
        {profile.fullName}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Student ID : {profile.studentId}
      </p>

      <button
        type="button"
        onClick={handleChooseFile}
        disabled={loadingPhotoUpload}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {loadingPhotoUpload
          ? "Uploading..."
          : "Upload New Photo"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ProfilePhotoUploader;