import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function HiringDriveDetails() {
    const { id } = useParams();
    const [drive, setDrive] = useState(null);
    const [exam, setExam] = useState(null);
    const [userId, setUserId] = useState("");
    const [examId, setExamId] = useState("");
    const [attempts, setAttempts] = useState(0);

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
        await api.post(`/hiring-drives/${id}/candidates`, { userId });
        setUserId("");
        fetchDrive();
    };

    const removeCandidate = async (uid) => {
        await api.delete(`/hiring-drives/${id}/candidates/${uid}`);
        fetchDrive();
    };

    const updateAttempts = async (uid) => {
        await api.patch(`/hiring-drives/${id}/candidates/${uid?._id}/attempts`, {
            attemptsUsed: attempts,
        });
        fetchDrive();
    };

    const addExam = async () => {
        await api.post(`/hiring-drives/${id}/exam`, { examId });
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
            <h1>{drive?.count}</h1>
            {console.log(drive)}

            <h3>Candidates</h3>
            <input
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={addCandidate}>Add Candidate</button>

            <ul>
                {drive?.data?.map((c) => (
                    <li key={c?.userId?._id}>
                        {console.log(c)}
                        {c.userId?.name || c.userId?._id} — Attempts: {c.attemptsUsed}
                        <button onClick={() => removeCandidate(c.userId?._id)}>Remove</button>
                        <input
                            type="number"
                            placeholder="Attempts"
                            onChange={(e) => setAttempts(e.target.value)}
                        />
                        <button onClick={() => updateAttempts(c.userId)}>
                            Update Attempts
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Exams</h3>
            <input
                placeholder="Exam ID"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
            />
            <button onClick={addExam}>Add Exam</button>

            <ul>
                {exam?.data?.map((e) => (
                    <li key={e?._id}>
                        {JSON.stringify(e)}
                        <button onClick={() => removeExam(e?._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
