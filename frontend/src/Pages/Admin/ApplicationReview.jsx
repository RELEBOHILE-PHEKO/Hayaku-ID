import React, { useEffect, useState } from "react";
import applicationService from "../../Services/ApplicationService.js";

const ApplicationReview = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        applicationService.getPendingApplications().then(setApplications);
    }, []);

    return (
        <div>
            <h1>Application Review</h1>
            <ul>
                {applications.map((app) => (
                    <li key={app.id}>
                        {app.name} - {app.status}
                        <button>Approve</button>
                        <button>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApplicationReview;
