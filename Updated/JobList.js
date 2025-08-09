import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7210/api/Jobs") // the endpoint for fetching jobs
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);
return (
    <div>
      <h2>Available Job Openings</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.jobId}>
            <h3>{job.jobName}</h3>
            <p>{job.description}</p>
            <p><b>Type:</b> {job.type}</p>
            <p><b>WorkMode: </b>{job.workMode}</p>
            <Link to={`/apply/${job.jobId}`}>Apply</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
