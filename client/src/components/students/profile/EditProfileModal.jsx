import { useEffect, useState } from "react";

function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  loading,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    schoolName: "",
    className: "",
    section: "",
    rollNumber: "",
    state: "",
    district: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        dob: profile.dob ? profile.dob.substring(0, 10) : "",
        gender: profile.gender || "",
        schoolName: profile.schoolName || "",
        className: profile.className || "",
        section: profile.section || "",
        rollNumber: profile.rollNumber || "",
        state: profile.state || "",
        district: profile.district || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-6">
                <h2 className="text-2xl font-semibold">
                Edit Profile
                </h2>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="text-2xl text-gray-500 transition hover:text-red-500"
                >
                ×
                </button>
        </div>
    
        <form onSubmit={handleSubmit}>
        <div className="grid gap-5 p-6 md:grid-cols-2">
                {/* Full Name */}

            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
            </label>

            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Phone */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
            </label>

            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Date of Birth */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Date of Birth
            </label>

            <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Gender */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Gender
            </label>

            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            </div>

            {/* School */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                School Name
            </label>

            <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Class */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Class
            </label>

            <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Section */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Section
            </label>

            <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Roll Number */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Roll Number
            </label>

            <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* State */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                State
            </label>

            <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* District */}
            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                District
            </label>

            <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Bio
            </label>

            <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
        </div>
    </div>
          <div className="flex justify-end gap-4 border-t p-6">
            <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
          </form>
        </div>
    </div>
        
        
);
}
export default EditProfileModal;