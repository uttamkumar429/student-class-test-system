import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StudentToolbar from "../../components/students/StudentToolbar";
import StudentTable from "../../components/students/StudentTable";
import api from "../../services/api";
 import { toast } from "sonner";
import AddStudentModal from "../../components/students/AddStudentModal";
function Students() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const fetchStudents = async () => {
    try {

      const response = await api.get("/admin/students");

        setStudents(response.data.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

  };
    const handleEdit = (student) => {
      setSelectedStudent(student);
      setIsModalOpen(true);
    };

  // import { toast } from "sonner";

  const handleDelete = async (student) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.fullName}?`
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/admin/students/${student._id}`);

      toast.success("Student deleted successfully.");

      await fetchStudents();

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete student."
      );

    }

  };
    useEffect(() => {
      fetchStudents();
    }, []);
    const filteredStudents = students.filter((student) => {

    const keyword = search.toLowerCase();

    return (
        student.fullName?.toLowerCase().includes(keyword) ||
        student.userId?.toLowerCase().includes(keyword) ||
        student.email?.toLowerCase().includes(keyword)
    );

    });
  return (

    <DashboardLayout>

      <h1 className="mb-2 text-3xl font-bold">
        Students
      </h1>

      <p className="mb-8 text-slate-500">
        Manage all students here.
      </p>

    <StudentToolbar
        search={search}
        setSearch={setSearch}
        onAddStudent={() => setIsModalOpen(true)}
    />

      <StudentTable
        students={filteredStudents}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        fetchStudents={fetchStudents}
        student={selectedStudent}
      />
    </DashboardLayout>

  );

}

export default Students;