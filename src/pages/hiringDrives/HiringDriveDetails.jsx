import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

import { DateTime } from "luxon";

const formatDateTime = (iso) => {
    if (!iso) return "-";
    return DateTime.fromISO(iso).toFormat("dd LLL yyyy, hh:mm a");
};

export default function HiringDriveDetails() {
    const { id } = useParams();
    const [drive, setDrive] = useState(null);
    const [exam, setExam] = useState(null);
    const [userId, setUserId] = useState("");
    const [examId, setExamId] = useState("");

    const fetchDrive = async () => {
        const { data } = await api.get(`/hiring-drives/${id}/candidates`);
        setDrive(data || {});
    };

    const fetchExam = async () => {
        const { data } = await api.get(`/hiring-drives/${id}/exams`);
        setExam(data || {});
    };
    useEffect(() => {
        fetchDrive();
        fetchExam();
    }, [id]);

    if (!drive) return <p>Loading...</p>;

    const addCandidate = async () => {
        await api.post(`/hiring-drives/${id}/candidates`, { userId: [userId] });
        setUserId("");
        fetchDrive();
    };

    const removeCandidate = async (uid) => {
        await api.delete(`/hiring-drives/${id}/candidates/${uid}`);
        fetchDrive();
    };

    const incAttempts = async (uid) => {
        await api.patch(`/hiring-drives/${id}/candidates/${uid}/attempts/inc`);
        fetchDrive();
    };

    const decAttempts = async (uid) => {
        await api.patch(`/hiring-drives/${id}/candidates/${uid}/attempts/dec`);
        fetchDrive();
    };

    const addExam = async () => {
        await api.post(`/hiring-drives/${id}/exam`, { examIds: [examId] });
        setExamId("");
        fetchDrive();
    };

    const removeExam = async (eid) => {
        await api.delete(`/hiring-drives/${id}/exams/${eid}`);
        fetchDrive();
    };

    return (
        <div>
            <Link to="/hiring-drives">⬅ Back</Link>
            <h3> Total Drive Count: {drive?.count}</h3>

            <h3>Candidates</h3>
            <input
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={addCandidate}>Add Candidate</button>

            {drive?.data?.length === 0 ? (
                <p>No candidates found</p>
            ) : (
                <table
                    border="1"
                    style={{
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Attempts Used</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {drive?.data?.map((c) => (
                            <tr key={c?.userId?._id}>
                                <td>
                                    <b>{c.userId?.name || "-"}</b>
                                </td>

                                <td>{c.userId?.email || "-"}</td>

                                <td>
                                    <b>{c.attemptsUsed}</b>
                                </td>

                                <td style={{ display: "flex", gap: 10 }}>
                                    <button onClick={() => incAttempts(c.userId?._id)}>
                                        Attempts +1
                                    </button>

                                    <button onClick={() => decAttempts(c.userId?._id)}>
                                        Attempts -1
                                    </button>

                                    <button onClick={() => removeCandidate(c.userId?._id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            )}

            <h3>Exams</h3>
            <input
                placeholder="Exam ID"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
            />
            <button onClick={addExam}>Add Exam</button>

            {exam?.data?.length === 0 ? (
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
                            <th>Duration (min)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {exam?.data?.map((e) => (
                            <tr key={e?._id}>
                                <td>
                                    <b>{e?.title || "-"}</b>
                                </td>

                                <td>{e?.description || "-"}</td>

                                <td style={{ textTransform: "capitalize" }}>
                                    {e?.difficulty || "-"}
                                </td>

                                <td>{e?.duration ?? "-"}</td>

                                <td style={{ color: e?.isActive ? "green" : "red" }}>
                                    {e?.isActive ? "Active ✅" : "Inactive ❌"}
                                </td>

                                <td>
                                    <button onClick={() => removeExam(e?._id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}
