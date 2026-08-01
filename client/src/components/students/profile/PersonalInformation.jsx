import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";

function PersonalInformation({ profile }) {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
  } = profile;

  const personalInfo = [
    {
      icon: <FaUser />,
      label: "Full Name",
      value: fullName || "-",
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: email || "-",
    },
    {
      icon: <FaPhone />,
      label: "Phone",
      value: phone || "-",
    },
    {
      icon: <FaBirthdayCake />,
      label: "Date of Birth",
      value: dob
        ? new Date(dob).toLocaleDateString()
        : "-",
    },
    {
      icon: <FaVenusMars />,
      label: "Gender",
      value: gender || "-",
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Personal Information
      </h2>

      <div className="space-y-5">
        {personalInfo.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-4"
          >
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {item.label}
              </p>

              <p className="text-base font-medium text-gray-900 break-all">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PersonalInformation;