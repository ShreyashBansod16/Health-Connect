"use client";
import { useState } from "react";

export default function DoctorsPage() {
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");

  async function addDoctor() {
    try {
      setLoading(true);
      const response = await fetch("api/appointmnet", { // Updated the URL to the correct API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: doctorName, specialization }),
      });

      if (!response.ok) throw new Error("Failed to add doctor");

      alert("Doctor added successfully!");
      setDoctorName("");
      setSpecialization("");
    } catch (error) {
      console.error("Failed to add doctor:", error);
      alert("Error adding doctor!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>
      <div className="mb-4">
        <label htmlFor="doctorName" className="block mb-2">
          Doctor Name
        </label>
        <input
          id="doctorName"
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="specialization" className="block mb-2">
          Specialization
        </label>
        <input
          id="specialization"
          type="text"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={addDoctor} disabled={loading} className="w-full p-2 bg-green-500 text-white rounded">
        {loading ? "Adding..." : "Add Doctor"}
      </button>
    </div>
  );
}
