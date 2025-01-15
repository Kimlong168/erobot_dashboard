import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import CKEditor from "../../components/CKeditor";
// import formatDate from "../../utils/fomatDate";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
import VolunteerForm from "../../components/VolunteerForm";
import YoutubeForm from "../../components/YoutubeForm";
import { FaX } from "react-icons/fa6";
// import OrganizerForm from "../../components/OrganizerForm";

const CreateProject = () => {
  const { partnerList: oldPartnerList, setShowNotification } =
    useContext(DataContext);
  const partnerList = [
    {
      id: "1",
      partnerName: "ERobot",
      partnerLogo: "https://erobot-frontend.vercel.app/images/light.png",
    },
    ...oldPartnerList,
  ];
  // state
  const [project, setProject] = useState({
    galleryImagesFolderName: `gallery_${Date.now()}`,
    name: "",
    description: "",
    content: "",
    coverImage: "",
    startDate: "",
    endDate: "",
    status: "current", // current, upcoming, previous
    location: "",
    duration: 1,
    budget: 0,
    fundsRaised: 0,
    fundingGoal: 0,
    beneficiariesCount: 0,
    organizers: [],
    coOrganizers: [],
    volunteers: [],
    targetGroup: "",
    images: [],
    videos: [],
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    tags: [],
  });
  const [images, setImages] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [youtubes, setYoutubes] = useState([]);
  const [organizers, setOrganizers] = useState([
    {
      id: "1",
      partnerName: "ERobot",
      partnerLogo: "https://erobot-frontend.vercel.app/images/light.png",
    },
  ]);
  const [coOrganizers, setCoOrganizers] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);

  let navigate = useNavigate();
  const projectCollectionRef = collection(db, "projects");

  // update context
  const { setIsUpdated } = useContext(UpdateContext);

  // handle onChange event for input
  const handleOnChange = (e) => {
    if (e.target.name === "coverImage" || e.target.name === "images") {
      setProject({
        ...project,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  // handle CKEditor change
  const handleEditorChange = (content) => {
    setProject({
      ...project,
      content: content,
    });
  };

  // create project function
  const createProject = (imageUrl, imageId) => {
    addDoc(projectCollectionRef, {
      galleryImagesFolderName: project.galleryImagesFolderName,
      name: project.name,
      description: project.description,
      content: project.content,
      coverImage: imageUrl,
      coverImageId: imageId,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      location: project.location,
      duration: calculateDuration(project.startDate, project.endDate),
      budget: parseFloat(project.budget),
      fundsRaised: parseFloat(project.fundsRaised),
      fundingGoal: parseFloat(project.fundingGoal),
      beneficiariesCount: parseInt(project.beneficiariesCount),
      organizers: organizers,
      coOrganizers: coOrganizers,
      volunteers: volunteers,
      targetGroup: project.targetGroup,
      images: project.images,
      videos: youtubes,
      contactPerson: project.contactPerson,
      email: project.email,
      phone: project.phone,
      website: project.website,
      tags: project.tags,
    });

    // update data
    setIsUpdated((prev) => !prev);

    // show notification
    setShowNotification({
      status: true,
      item: "project",
      action: "created",
    });

    console.log("Project created!", project.name);
  };

  // upload image to firebase storage and create project
  const uploadImageAndCreateProject = () => {
    navigate("/project");

    // generate image ID
    const projectNameNoSpaces = project.name.replace(/\s+/g, "");
    const timestamp = new Date().getTime();
    const imageId = `${projectNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `projectCoverImages/${imageId}`);
    uploadBytes(imageRef, project.coverImage).then(() => {
      // get download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("project cover image URL:", downloadURL);
          // store project and image to Firestore
          createProject(downloadURL, imageId);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });
    });
  };

  const deleteImageFromStorage = (imageId) => {
    // delete image from firebase storage
    const storageRef = ref(
      storage,
      `projectGalleryImages/${project.galleryImagesFolderName}/${imageId}`
    );
    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log("image deleted successfully");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  };

  const uploadFiles = async () => {
    setIsUploaded(true);
    // upload images to firebase storage
    for (let i = 0; i < images.length; i++) {
      const fullNameNoSpaces = images[i].name.replace(/\s+/g, "");
      const timestamp = new Date().getTime();
      // Concatenate full name and timestamp to create the ID
      const imageId = `${fullNameNoSpaces}_${timestamp}`;

      const imageRef = ref(
        storage,
        `projectGalleryImages/${project.galleryImagesFolderName}/${imageId}`
      );
      await uploadBytes(imageRef, images[i])
        .then(() => {
          // Get the download URL for the uploaded image
          getDownloadURL(imageRef)
            .then((downloadURL) => {
              console.log(" image URL:", downloadURL);

              setProject((prev) => ({
                ...prev,
                images: [
                  ...prev.images,
                  { name: images[i].name, url: downloadURL, imageId: imageId },
                ],
              }));
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });

          console.log("success");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    console.log("images uploaded");
    setImages(null);

    // notify("Images uploaded successfully", "success");
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0; // Ensure both dates are present
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;
    return durationInMilliseconds > 0
      ? Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24)) + 1
      : 0; // Return 0 for negative durations
  };

  return (
    <Layout>
      <div className="text-gray-900 border-gray-700 rounded">
        <div className="text-center p-4 pt-0 font-bold text-3xl text-violet-600 underline uppercase">
          Create Project
        </div>
        <br />

        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom ">
          <div className="w-full flex flex-col border border-white/50 rounded-3xl ">
            <div className="w-full">
              <label className="font-bold text-xl">
                Project Name
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="name"
                value={project.name}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              <div className="w-full">
                <label className="font-bold text-xl">
                  Cover Image <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
                  type="file"
                  name="coverImage"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">
                  Status <RedStar />
                </label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="status"
                  value={project.status}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value="current">Current</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="previous">Previous</option>
                </select>
              </div>

              <div className="w-full">
                <label className="font-bold mb-2 text-xl">
                  Location <RedStar />
                </label>
                <input
                  type="text"
                  name="location"
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  value={project.location}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              <div className="w-full">
                <label className="font-bold text-xl">
                  Start Date <RedStar />
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  value={project.startDate}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="w-full">
                <label className="font-bold text-xl">
                  End Date <RedStar />
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  value={project.endDate}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="w-full">
                <label className="font-bold text-xl">Duration (days)</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="duration"
                  value={calculateDuration(project.startDate, project.endDate)}
                  readOnly
                />
              </div>
            </div>

            <label className="font-bold text-xl">
              Description <RedStar />
            </label>
            <textarea
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              name="description"
              value={project.description}
              onChange={(e) => handleOnChange(e)}
            />

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              <div className="w-full">
                <label className="font-bold text-xl">
                  Budget ($)
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="budget"
                  value={project.budget}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="w-full">
                <label className="font-bold text-xl">
                  Funds Raised ($)
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="fundsRaised"
                  value={project.fundsRaised}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className="w-full">
                <label className="font-bold text-xl">
                  Funding Goal ($)
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="fundingGoal"
                  value={project.fundingGoal}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              <div className="w-full">
                <label className="font-bold text-xl">
                  Beneficiaries Count
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="beneficiariesCount"
                  value={project.beneficiariesCount}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>{" "}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Target Group
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="targetGroup"
                  value={project.targetGroup}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="w-full">
                <label className="font-bold text-xl">Website</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="url"
                  name="website"
                  value={project.website}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-bold text-xl">
                Tag
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="tags"
                placeholder="Separate tags with commas (eg: tag1, tag2, tag3)"
                value={project.tags}
                onChange={(e) => handleOnChange(e)}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {" "}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Contact Person
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="contactPerson"
                  value={project.contactPerson}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="w-full">
                <label className="font-bold text-xl">Email</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="email"
                  name="email"
                  value={project.email}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="w-full">
                <label className="font-bold text-xl">Phone</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="tel"
                  name="phone"
                  value={project.phone}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>
            <label className="font-bold text-xl">
              Content <RedStar />
            </label>
            <div className="mb-6">
              <CKEditor handleEditorChange={handleEditorChange} />
            </div>

            <div>
              <VolunteerForm
                title={"Volunteer"}
                volunteers={volunteers}
                setVolunteers={setVolunteers}
              />
            </div>

            <label className="font-bold text-xl">
              Select Organizer <RedStar />
            </label>
            <div className="flex items-center gap-5 mt-3 mb-6">
              {partnerList.map((partner) => {
                const isCoOrganizer = coOrganizers.some(
                  (coOrganizer) => coOrganizer.id === partner.id
                );
                if (isCoOrganizer) return null;
                const isSelected = organizers.some(
                  (organizer) => organizer.id == partner.id
                );
                return (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between border-b pb-2 mb-2"
                  >
                    <div
                      className="flex gap-5 flex-col"
                      onClick={() => {
                        if (isSelected) {
                          setOrganizers((prev) =>
                            prev.filter(
                              (organizer) => organizer.id !== partner.id
                            )
                          );
                        } else {
                          setOrganizers((prev) => [...prev, partner]);
                        }
                      }}
                    >
                      <div className="relative w-fit">
                        <img
                          src={partner.partnerLogo}
                          alt={partner.name}
                          className={`border-2 rounded-lg cursor-pointer h-[80px] w-[80px] ${
                            isSelected
                              ? "border-2 rounded cursor-pointer  border-green-600"
                              : ""
                          }`}
                        />
                        {isSelected && (
                          <span className="absolute top-1 right-1">✅</span>
                        )}
                      </div>
                      <p className="text-center">{partner.partnerName}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <label className="font-bold text-xl">Select Co-Organizer</label>
            <div className="flex items-center gap-5 mt-3 mb-6">
              {partnerList.map((partner) => {
                const isOrganizer = organizers.some(
                  (organizer) => organizer.id === partner.id
                );
                if (isOrganizer) return null;
                const isSelected = coOrganizers.some(
                  (coOrganizer) => coOrganizer.id === partner.id
                );
                return (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between border-b pb-2 mb-2"
                  >
                    <div
                      className="flex gap-5 flex-col"
                      onClick={() => {
                        if (isSelected) {
                          setCoOrganizers((prev) =>
                            prev.filter(
                              (coOrganizer) => coOrganizer.id !== partner.id
                            )
                          );
                        } else {
                          setCoOrganizers((prev) => [...prev, partner]);
                        }
                      }}
                    >
                      <div className="relative w-fit">
                        <img
                          width={80}
                          src={partner.partnerLogo}
                          alt={partner.name}
                          className={`border-2 rounded-lg cursor-pointer h-[80px] w-[80px] ${
                            isSelected
                              ? "border-2 rounded cursor-pointer  border-green-600"
                              : ""
                          }`}
                        />
                        {isSelected && (
                          <span className="absolute top-1 right-1">✅</span>
                        )}
                      </div>
                      <p className="text-center">{partner.partnerName}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <fieldset className="border border-gray-700 p-4 rounded-md shadow-md mb-10">
              <legend className="text-xl uppercase font-bold text-purple-700">
                Upload Images
              </legend>
              <div className=" text-gray-600 ">
                You can select multiple images to upload at once.{" "}
              </div>{" "}
              {isUploaded && (
                <div className=" text-gray-600 ">
                  <br />
                  You have uploaded{" "}
                  <span className="font-bold px-4 bg-green-500/30 rounded text-green-600 border border-green-600">
                    {project.images.length === 1
                      ? "1 image"
                      : project.images.length + "  images"}
                  </span>{" "}
                  successfully✅{" "}
                </div>
              )}
              <br />
              <input
                type="file"
                className="border border-gray-300 p-2 rounded w-full outline-none mb-5"
                multiple
                onChange={(event) => {
                  setImages(event.target.files);
                }}
              />
              <button
                onClick={
                  images ? uploadFiles : () => notify("No images selected")
                }
                className="border px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {isUploaded ? "Upload More?" : "Upload Images"}
              </button>
              {/* Images */}
              {project.images.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-lg mt-5">Images:</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                    {project.images.map((image, index) => (
                      <div key={index} className="relative">
                        {" "}
                        <img
                          src={image.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <span
                          onClick={() => {
                            setProject((prev) => ({
                              ...prev,
                              images: prev.images.filter(
                                (img) => img.imageId !== image.imageId
                              ),
                            }));
                            deleteImageFromStorage(image.imageId);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
                        >
                          <FaX />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>

            <div>
              <YoutubeForm
                title={"Youtube Videos"}
                youtubes={youtubes}
                setYoutubes={setYoutubes}
              />
            </div>

            {/* <div>
              <OrganizerForm
                title={"Organizer"}
                organizers={organizers}
                setOrganizers={setOrganizers}
              />
            </div>

            <div>
              <OrganizerForm
                title={"Co-Organizer"}
                organizers={coOrganizers}
                setOrganizers={setCoOrganizers}
              />
            </div> */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                project.name &&
                project.description &&
                project.content &&
                project.coverImage &&
                project.startDate &&
                project.endDate &&
                project.status &&
                project.location &&
                project.budget &&
                project.fundsRaised &&
                project.fundingGoal &&
                project.beneficiariesCount &&
                project.targetGroup &&
                project.contactPerson &&
                project.tags &&
                project.images &&
                organizers
                  ? uploadImageAndCreateProject
                  : notify
              }
            >
              Create Project
            </button>
          </div>
        </div>

        <Toast />

        <ButtonBack link="/project" />
      </div>
    </Layout>
  );
};

export default CreateProject;
