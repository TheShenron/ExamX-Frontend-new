import { useEffect, useState } from "react";
import api from "../../api/axios";
import { DateTime } from "luxon";

const formatDateTime = (iso) => {
    if (!iso) return "-";
    return DateTime.fromISO(iso).toFormat("dd LLL yyyy, hh:mm a");
};


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
        examZipFile: null,
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

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setForm((prev) => ({ ...prev, examZipFile: file }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (editingId) {
            await api.put(`/exams/${editingId}`, {
                ...form,
                updatedBy: form.createdBy,
            });
        } else {

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("difficulty", form.difficulty);
            formData.append("duration", String(form.duration));
            formData.append("createdBy", form.createdBy);
            formData.append("isActive", String(form.isActive));
            formData.append("examZipFile", form.examZipFile);

            await api.post("/exams", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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

                <input
                    type="file"
                    name="examZipFile"
                    accept=".zip"
                    onChange={handleFileChange}
                    required
                />

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
            {exams?.length === 0 ? (
                <p>No exams found</p>
            ) : (
                <table
                    border="1"
                    style={{
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Difficulty</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Created By</th>
                            <th>Updated At</th>
                            <th>Updated By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {exams?.map((e) => (
                            <tr key={e._id}>
                                <td>
                                    <b>{e.title}</b>
                                </td>

                                <td>{e.description || "-"}</td>

                                <td style={{ textTransform: "capitalize" }}>
                                    {e.difficulty || "-"}
                                </td>

                                <td>{e.duration} min</td>

                                <td style={{ color: e.isActive ? "green" : "red" }}>
                                    {e.isActive ? "Active ✅" : "Inactive ❌"}
                                </td>

                                <td>{formatDateTime(e.createdAt)}</td>

                                <td>
                                    {e.createdBy?.name || "-"}
                                    {/* <br />
                                    <span style={{ fontSize: 12, color: "#666" }}>
                                        {e.createdBy?.email || ""}
                                    </span> */}
                                </td>

                                <td>{formatDateTime(e.updatedAt)}</td>

                                <td>
                                    {e.updatedBy?.name || "-"}
                                    {/* <br />
                                    <span style={{ fontSize: 12, color: "#666" }}>
                                        {e.updatedBy?.email || ""}
                                    </span> */}
                                </td>

                                <td style={{ display: "flex", gap: 10 }}>
                                    <button onClick={() => editExam(e)}>Edit</button>
                                    <button onClick={() => deleteExam(e._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
