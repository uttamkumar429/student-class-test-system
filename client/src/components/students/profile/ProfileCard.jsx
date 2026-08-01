import { FaEdit } from "react-icons/fa";
import ProfilePhotoUploader from "./ProfilePhotoUploader";
import PersonalInformation from "./PersonalInformation";
import AcademicInformation from "./AcademicInformation";

function ProfileCard({ profile, onEdit }) {
  return (
    <section className="rounded-2xl bg-white shadow-lg">
      <div className="flex items-center justify-between border-b px-8 py-5">
        <h2 className="text-2xl font-bold text-gray-800">
          My Profile
        </h2>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <FaEdit size={14} />
          Edit Profile
        </button>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-1">
          <ProfilePhotoUploader profile={profile} />
        </div>

        {/* Right */}
        <div className="space-y-8 lg:col-span-2">
          <PersonalInformation profile={profile} />
          <AcademicInformation profile={profile} />
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;