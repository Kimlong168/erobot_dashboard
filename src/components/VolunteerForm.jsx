import { useState } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTrash } from "react-icons/fa";
const VolunteerForm = ({ title, volunteers, setVolunteers }) => {
  const [newVolunteer, setNewVolunteer] = useState({ name: "", role: "" });

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setNewVolunteer((prev) => ({ ...prev, [name]: value }));
  };

  const addVolunteer = () => {
    if (newVolunteer.name && newVolunteer.role) {
      setVolunteers((prev) => [
        ...prev,
        { id: `vol${prev.length + 2}`, ...newVolunteer },
      ]);
      setNewVolunteer({ name: "", role: "" }); // Reset input fields
    }
  };

  const removeVolunteer = (id) => {
    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">{title}</h1>{" "}
      </div>
      <div className="mb-5">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="flex items-center justify-between border-b pb-2 mb-2"
          >
            <div className="flex gap-5">
              <p>
                <strong>Name:</strong> {volunteer.name}
              </p>
              <p>
                <strong>Role:</strong> {volunteer.role}
              </p>
            </div>
            <button
              className="bg-red-500 text-white w-9 h-9 p-1 rounded grid place-content-center"
              onClick={() => removeVolunteer(volunteer.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center  gap-3 mb-5">
        <input
          type="text"
          name="name"
          placeholder="Volunteer Name"
          className="border border-gray-700 p-2 rounded w-full"
          value={newVolunteer.name}
          onChange={handleVolunteerChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Volunteer Role"
          className="border border-gray-700 p-2 rounded w-full"
          value={newVolunteer.role}
          onChange={handleVolunteerChange}
        />
        <div>
          <button
            className="bg-green-600 text-white w-9 h-9 rounded p-1 grid place-content-center"
            onClick={addVolunteer}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

VolunteerForm.propTypes = {
  title: PropTypes.string,
  volunteers: PropTypes.array,
  setVolunteers: PropTypes.func,
};

export default VolunteerForm;
