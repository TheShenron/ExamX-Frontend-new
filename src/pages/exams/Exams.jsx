import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Exams() {
    const [exams, setExams] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        difficulty: "easy",
        duration: 60,
        createdBy: "",
        isActive: true,
    });

    const fetchExams = async () => {
        const { data } = await api.get("/exams");
        setExams(data?.data || []);
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (editingId) {
            await api.put(`/exams/${editingId}`, {
                ...form,
                updatedBy: form.createdBy,
            });
        } else {
            await api.post("/exams", form);
        }

        resetForm();
        fetchExams();
    };

    const editExam = (exam) => {
        setEditingId(exam._id);
        setForm({
            userId: exam.userId,
            title: exam.title,
            description: exam.description || "",
            difficulty: exam.difficulty,
            duration: exam.duration,
            createdBy: exam.createdBy,
            isActive: exam.isActive,
        });
    };

    const deleteExam = async (id) => {
        if (!confirm("Delete exam?")) return;
        await api.delete(`/exams/${id}`, {
            data: { userId: form.createdBy },
        });
        fetchExams();
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "",
            description: "",
            difficulty: "easy",
            duration: 60,
            createdBy: "",
            isActive: true,
        });
    };

    return (
        <div>
            <h1>Exams API Tester</h1>

            {/* CREATE / UPDATE */}
            <form onSubmit={submitForm}>
                <h3>{editingId ? "Update Exam" : "Create Exam"}</h3>

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (minutes)"
                    value={form.duration}
                    onChange={handleChange}
                    min={1}
                    max={180}
                />

                <input
                    name="createdBy"
                    placeholder="Created By (User ID)"
                    value={form.createdBy}
                    onChange={handleChange}
                    required
                />

                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                    />
                    Active
                </label>

                <div>
                    <button type="submit">
                        {editingId ? "Update" : "Create"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <hr />

            {/* LIST */}
            <h3>All Exams</h3>
            <ul>
                {exams?.map((e) => (
                    <li key={e._id}>
                        <strong>{e.title}</strong> — {e.difficulty} — {e.duration} min
                        {!e.isActive && " (inactive)"}

                        <div>
                            <button onClick={() => editExam(e)}>Edit</button>
                            <button onClick={() => deleteExam(e._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
