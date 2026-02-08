import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { DateTime } from "luxon";

const formatDateTime = (iso) => {
    if (!iso) return "-";
    return DateTime.fromISO(iso).toFormat("dd LLL yyyy, hh:mm a");
};

const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "-";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}m ${secs}s`;
};

export default function UserResult() {
    const navigate = useNavigate();
    const { hiringDriveId } = useParams();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get(`/results/get/${hiringDriveId}`)
            .then((res) => setDrives(res.data))
            .finally(() => setLoading(false));
    }, [hiringDriveId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>User Results</h1>
            <button onClick={() => navigate(-1)}>
                ⬅ Back
            </button>

            {drives?.data?.length === 0 ? (
                <p>No results found</p>
            ) : (
                <table
                    border="1"
                    style={{
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th>Score</th>
                            <th>Result</th>
                            <th>Duration (sec)</th>
                            <th>Started At</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {drives?.data?.map((result) => {
                            return (
                                <tr key={result._id}>

                                    <td>{result?.score ?? "-"}</td>

                                    <td style={{ fontWeight: "bold", color: result?.isPassed ? "green" : "red" }}>
                                        {result ? (result.isPassed ? "Passed ✅" : "Failed ❌") : "Not Attempted"}
                                    </td>

                                    <td>{formatDuration(result?.durationTaken ?? 0)}</td>

                                    <td>{result?.startedAt ? formatDateTime(result.startedAt) : "-"}</td>
                                    <td>{result?.submittedAt ? formatDateTime(result.submittedAt) : "-"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}


        </div>
    );
}
