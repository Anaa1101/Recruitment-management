import React, { useState, useEffect } from "react";
import axios from "axios";

function HRPage() {
  const [activePage, setActivePage] = useState("Jobs");
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]); // all candidates
  const [newJob, setNewJob] = useState({
    jobId: 0,
    jobName: "",
    description: "",
    type: "",
    workMode: ""
  });

  // For Candidates page job selection
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const jobsRes = await axios.get("https://localhost:7210/api/Jobs");
      setJobs(jobsRes.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      const candidatesRes = await axios.get("https://localhost:7210/api/Candidates");
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  // Post a new job
  const handlePostJob = async (e) => {
    e.preventDefault();

    if (!newJob.jobName || !newJob.type || !newJob.workMode) {
      alert("Please fill in all required fields: Job Name, Type, Work Mode");
      return;
    }

    try {
      await axios.post("https://localhost:7210/api/Jobs", newJob);
      alert("Job posted successfully!");
      setNewJob({
        jobId: 0,
        jobName: "",
        description: "",
        type: "",
        workMode: ""
      });
      fetchJobs();
    } catch (err) {
      console.error("Error posting job:", err);
      alert("Failed to post job");
    }
  };

  // Filter candidates for selected job on frontend
  const filteredCandidates = selectedJob
    ? candidates.filter((c) => c.jobId === selectedJob.jobId)
    : [];

  const sidebarItems = ["Jobs", "Candidates", "HR Info", "Reports"];

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>HR Panel</h3>
        {sidebarItems.map((item) => (
          <div
            key={item}
            style={{
              ...styles.sidebarItem,
              ...(activePage === item ? styles.activeSidebarItem : {}),
            }}
            onClick={() => {
              setActivePage(item);
              setSelectedJob(null); // Reset when switching tabs
            }}
          >
            {item}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={{ marginBottom: "20px" }}>HR Portal</h1>

        {/* Jobs Page */}
        {activePage === "Jobs" && (
          <div>
            <h2>Post a New Job</h2>
            <form onSubmit={handlePostJob} style={styles.form}>
              <input
                type="text"
                placeholder="Job Name *"
                value={newJob.jobName}
                onChange={(e) =>
                  setNewJob({ ...newJob, jobName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Job Type *"
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Work Mode * (e.g., Remote, On-site)"
                value={newJob.workMode}
                onChange={(e) =>
                  setNewJob({ ...newJob, workMode: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
              />
              <button type="submit">Post Job</button>
            </form>

            <h2 style={{ marginTop: "30px" }}>Existing Jobs</h2>
            <ul>
              {jobs.map((job) => (
                <li key={job.jobId}>
                  {job.jobName} - {job.type || "N/A"} - {job.workMode || "N/A"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Candidates Page */}
        {activePage === "Candidates" && (
          <div>
            {!selectedJob ? (
              <>
                <h2>Select a Job to View Candidates</h2>
                {jobs.length === 0 ? (
                  <p>No jobs available</p>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job.jobId}
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                      }}
                      onClick={() => setSelectedJob(job)}
                    >
                      <h3>{job.jobName}</h3>
                      <p>
                        {job.type} - {job.workMode}
                      </p>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedJob(null)}
                  style={{
                    marginBottom: "20px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  ⬅ Back to Jobs
                </button>
                <h2>Candidates for {selectedJob.jobName}</h2>
                {filteredCandidates.length === 0 ? (
                  <p>No candidates applied for this job yet.</p>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.candidateId}
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <h3>{candidate.name}</h3>
                      <p>Email: {candidate.email}</p>
                      <p>Phone: {candidate.phone}</p>
                      <p>Experience: {candidate.experience} years</p>
                      <p>College: {candidate.college}</p>
                      <p>Skills: {candidate.skills}</p>
                      {candidate.resumeFilePath && (
                        <a
                          href={`https://localhost:7210${candidate.resumeFilePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#1e1e2f",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "600",
    padding: "0 20px 20px 20px",
  },
  sidebarItem: {
    padding: "12px 20px",
    cursor: "pointer",
    transition: "0.3s",
  },
  activeSidebarItem: {
    backgroundColor: "#4e8ef7",
    borderLeft: "4px solid white",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    gap: "10px",
  },
};

export default HRPage;
