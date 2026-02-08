import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

import { DateTime } from "luxon";

const formatDateTime = (iso) => {
    if (!iso) return "-";
    return DateTime.fromISO(iso).toFormat("dd LLL yyyy, hh:mm a");
};

export default function HiringDrives() {
    const [drives, setDrives] = useState([]);
    const [form, setForm] = useState({
        name: "",
        code: "",
        difficulty: "easy",
        passingMarks: 50,
        startsAt: "",
        endsAt: "",
    });

    const fetchDrives = async () => {
        const res = await api.get("/hiring-drives");
        setDrives(res.data);
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createDrive = async (e) => {
        e.preventDefault();
        await api.post("/hiring-drives", form);
        setForm({
            name: "",
            code: "",
            difficulty: "easy",
            passingMarks: 50,
            startsAt: "",
            endsAt: "",
        });
        fetchDrives();
    };

    const deleteDrive = async (id) => {
        if (!confirm("Delete hiring drive?")) return;
        await api.delete(`/hiring-drives/${id}`);
        fetchDrives();
    };

    return (
        <div>
            <h1>Hiring Drives</h1>

            <form onSubmit={createDrive}>
                <h3>Create Hiring Drive</h3>

                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input name="code" placeholder="Code" value={form.code} onChange={handleChange} required />

                <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <input
                    type="number"
                    name="passingMarks"
                    placeholder="Passing Marks"
                    value={form.passingMarks}
                    onChange={handleChange}
                />

                <input type="datetime-local" name="startsAt" value={form.startsAt} onChange={handleChange} />
                <input type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange} />

                <button>Create</button>
            </form>

            <hr />

            <h3>All Drives</h3>

            {drives?.data?.length === 0 ? (
                <p>No hiring drives found</p>
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
                            <th>Code</th>
                            <th>Difficulty</th>
                            <th>Passing Marks</th>
                            <th>Starts At</th>
                            <th>Ends At</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {drives?.data?.map((d) => (
                            <tr key={d._id}>
                                <td>
                                    <b>{d.name}</b>
                                </td>

                                <td>
                                    <b>{d.code}</b>
                                </td>

                                <td style={{ textTransform: "capitalize" }}>
                                    {d.difficulty || "-"}
                                </td>

                                <td>{d.passingMarks ?? "-"}</td>

                                <td>{formatDateTime(d.startsAt)}</td>

                                <td>{formatDateTime(d.endsAt)}</td>

                                <td style={{ color: d.isActive ? "green" : "red" }}>
                                    {d.isActive ? "Active ✅" : "Inactive ❌"}
                                </td>

                                <td>{formatDateTime(d.createdAt)}</td>

                                <td>{formatDateTime(d.updatedAt)}</td>

                                <td style={{ display: "flex", gap: 10 }}>
                                    <Link to={`/hiring-drives/${d._id}`}>Manage</Link>

                                    <button onClick={() => deleteDrive(d._id)}>
                                        Delete
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
