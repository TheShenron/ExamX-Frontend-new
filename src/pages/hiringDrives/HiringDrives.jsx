import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

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
            <ul>
                {drives?.data?.map((d) => (
                    <li key={d._id}>
                        <strong>{d.name}</strong> ({d.code})
                        <Link to={`/hiring-drives/${d._id}`}> Manage</Link>
                        <button onClick={() => deleteDrive(d._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
