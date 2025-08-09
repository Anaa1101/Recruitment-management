import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./JobApply.css"; // Optional: For styling

const JobApply = () => {
  const { jobId } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    college: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // Handle text field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle skill input and tag addition
  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", form.name);
    formData.append("Email", form.email);
    formData.append("Phone", form.phone);
    formData.append("Experience", form.experience);
    formData.append("College", form.college);
    formData.append("Skills", skills.join(","));
    formData.append("JobId", jobId);
    if (resumeFile) {
      formData.append("resumeFile", resumeFile);
    }

    try {
      await axios.post("https://localhost:7210/api/Candidates", formData);//I mistyped the endpoint here
      alert("Application submitted!");
      // Clear form
      setForm({ name: "", email: "", phone: "", experience: "", college: "" });
      setSkills([]);
      setSkillInput("");
      setResumeFile(null);
    } catch (err) {
      alert("Application failed: " + err.message);
    }
  };

  return (
    <div className="job-apply-container">
      <h2>Apply for Job ID: {jobId}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input type="number" name="experience" placeholder="Experience (years)" value={form.experience} onChange={handleChange} required />
        <input type="text" name="college" placeholder="Your College" value={form.college} onChange={handleChange} required />
        
        {/* Skills as tags */}
        <div className="skills-input">
          <input
            type="text"
            placeholder="Add skills (press Enter)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
          />
          <div className="tags">
            {skills.map((skill, index) => (
              <span className="tag" key={index}>
                {skill} <button type="button" onClick={() => removeSkill(index)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Resume file */}
        <input type="file" name="resumeFile" onChange={handleFileChange} required />

        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default JobApply;
