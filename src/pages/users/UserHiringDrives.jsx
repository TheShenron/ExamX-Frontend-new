import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function UserHiringDrives() {
    const { userId } = useParams();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get(`/users/${userId}/hiring-drives`)
            .then((res) => setDrives(res.data))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>User Hiring Drives</h1>
            <Link to="/users">⬅ Back</Link>

            {drives.length === 0 ? (
                <p>No hiring drives found</p>
            ) : (
                <ul>
                    {drives?.data?.map((d) => (
                        <li key={d._id}>
                            {JSON.stringify(d)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
