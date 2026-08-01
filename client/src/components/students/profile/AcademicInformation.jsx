import {
  FaSchool,
  FaGraduationCap,
  FaUsers,
  FaIdBadge,
  FaMapMarkerAlt,
  FaBookOpen,
} from "react-icons/fa";

function AcademicInformation({ profile }) {
  const academicDetails = [
    {
      label: "School Name",
      value: profile.schoolName,
      icon: FaSchool,
    },
    {
      label: "Class",
      value: profile.className,
      icon: FaGraduationCap,
    },
    {
      label: "Section",
      value: profile.section,
      icon: FaUsers,
    },
    {
      label: "Roll Number",
      value: profile.rollNumber,
      icon: FaIdBadge,
    },
    {
      label: "State",
      value: profile.state,
      icon: FaMapMarkerAlt,
    },
    {
      label: "District",
      value: profile.district,
      icon: FaMapMarkerAlt,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Academic Information
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {academicDetails.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Icon size={18} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <p className="font-medium text-gray-900">
                  {item.value || "Not Available"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <FaBookOpen size={18} />
          </div>

          <h3 className="font-medium text-gray-900">
            Bio
          </h3>
        </div>

        <p className="text-gray-700">
          {profile.bio || "No bio added yet."}
        </p>
      </div>
    </div>
  );
}

export default AcademicInformation;