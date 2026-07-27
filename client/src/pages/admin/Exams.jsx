import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getExams,
  deleteExam,
} from "../../services/examService";

import ExamToolbar from "../../components/exams/ExamToolbar";
import ExamTable from "../../components/exams/ExamTable";
import AddExamModal from "../../components/exams/AddExamModal";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");



  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getExams();

            console.log("Response:", response);
            console.log("Response.data:", response.data);

            setExams(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);
        
        useEffect(() => {
            fetchExams();
        }, [fetchExams]);
    console.log("Exams State:", exams);
    const filteredExams = useMemo(() => {
        return exams.filter((exam) => {
            return (
                exam.title?.toLowerCase().includes(search.toLowerCase()) ||
                exam.subject?.toLowerCase().includes(search.toLowerCase()) ||
                exam.className?.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [search, exams]);
    
    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
   };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
        "Are you sure you want to delete this exam?"
        );

        if (!confirmDelete) return;

        try {
            await deleteExam(id);

            toast.success("Exam deleted successfully.");

            await fetchExams();
        } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to delete exam."
        );
        }
    };

    return (
    <>
        <ExamToolbar
            search={search}
            setSearch={setSearch}
            onAdd={() => {
            setSelectedExam(null);
            setIsModalOpen(true);
            }}
        />

        <ExamTable
            exams={filteredExams}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />

        <AddExamModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            fetchExams={fetchExams}
            exam={selectedExam}
        />
        </>
    );

}
export default Exams;

