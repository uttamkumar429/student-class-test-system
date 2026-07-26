import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "sonner";
function AddStudentModal({
  isOpen,
  onClose,
  fetchStudents,
  student,
}) {
  const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  //input handler
  const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

    };
    useEffect(() => {
        if (student) {
            setFormData({
            fullName: student.fullName || "",
            email: student.email || "",
            phone: student.phone || "",
            password: "",
            });
        } else {
            setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            });
        }

        setErrors({});
    }, [student]);
    const validateForm = () => {

        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits.";
        }

        if (!student) {
            if (!formData.password) {
                newErrors.password = "Password is required.";
            } else if (formData.password.length < 8) {
                newErrors.password =
                "Password must be at least 8 characters.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };    
    const handleClose = () => {

        setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
        });

        setErrors({});

        onClose();

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
         return;
        }
    try {
        setLoading(true);

        if (student) {
            await api.put(
                `/admin/students/${student._id}`,
                formData
            );

            toast.success("Student updated successfully.");
        } else {
            await api.post(
                "/admin/students",
                formData
            );

            toast.success("Student added successfully.");
        }
            // Refresh Student List
            await fetchStudents();

            // Reset Form
            setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            });

            // Close Modal
            handleClose();

            // toast.success("Student added successfully.");

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add student."
            );
        } finally {
            setLoading(false);
        }
    };
    

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {student ? "Edit Student" : "Add Student"}
          </h2>
          <button
            onClick={handleClose}
            className="text-2xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>

        </div>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-5"
            >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
                autoFocus
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
            {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.fullName}
                </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
            {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.email}
                </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>
            <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
            {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.phone}
                </p>
            )}
          </div>

        {!student && (
            <div>
                <label className="mb-2 block text-sm font-medium">
                 Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                    />

                {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.password}
                </p>
                )}
            </div>
            )}

          <div className="col-span-2 flex justify-end gap-3">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                {loading
                ? student
                    ? "Updating..."
                    : "Adding..."
                : student
                    ? "Update Student"
                    : "Add Student"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddStudentModal;