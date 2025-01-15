import { useState } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTrash } from "react-icons/fa";
import YoutubeDisplay from "./YoutubeDisplay";

const YoutubeForm = ({ title, youtubes, setYoutubes }) => {
  const [newYoutbe, setNewYoutube] = useState({ name: "", role: "" });

  const handleYoutubeChange = (e) => {
    const { name, value } = e.target;
    setNewYoutube((prev) => ({ ...prev, [name]: value }));
  };

  const addYoutube = () => {
    if (newYoutbe.url) {
      setYoutubes((prev) => [
        ...prev,
        { id: `vol${prev.length + 2}`, ...newYoutbe },
      ]);
      setNewYoutube({ url: "" }); // Reset input fields
    }
  };

  const removeYoutube = (id) => {
    setYoutubes((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">{title}</h1>{" "}
      </div>
      <div className="mb-5">
        {youtubes.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-2 mb-2"
          >
            <div>
              <YoutubeDisplay url={item.url} />
            </div>
            <button
              className="bg-red-500 text-white w-9 h-9 p-1 rounded grid place-content-center"
              onClick={() => removeYoutube(item.id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center  gap-3 mb-5">
        <input
          type="text"
          name="url"
          placeholder="Url"
          className="border border-gray-700 p-2 rounded w-full"
          value={newYoutbe.url}
          onChange={handleYoutubeChange}
        />
        <div>
          <button
            className="bg-green-600 text-white w-9 h-9 rounded p-1 grid place-content-center"
            onClick={addYoutube}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

YoutubeForm.propTypes = {
  title: PropTypes.string,
  youtubes: PropTypes.array,
  setYoutubes: PropTypes.func,
};

export default YoutubeForm;
