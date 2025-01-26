import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { FiEdit } from "react-icons/fi";
import { IoChevronBackCircle } from "react-icons/io5";

import Loading from "../../components/Loading";
import ContentDisplay from "../../components/ContentDisplay";
import GoToTop from "../../components/GoToTop";
// import YoutubeDisplay from "../../components/YoutubeDisplay";
import formatDate from "../../utils/fomatDate";
// import { DataContext } from "../../contexts/DataContext";
const ProjectDetail = () => {
  const { id: projectParams } = useParams();
  //   const { projectCategoryList, authorList } = useContext(DataContext);
  const [project, setProject] = useState(null);
  const [newBogParam, setNewBogParam] = useState(projectParams);

  // fetch project base on id or projectParams
  useEffect(() => {
    // check if the projectParams is update-xxxx (after updating)
    const match = projectParams.match(/update-(.+)/);
    // Check if there is a match and retrieve the id
    const newParams = match ? match[1] : projectParams;
    setNewBogParam(newParams);

    const docRef = doc(db, "projects", newParams);

    const fetchProject = async () => {
      try {
        // if we view the detail after updating we delay 1000 to make sure data is fetched successfully
        if (match) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const project = docSnap.data();

          setProject(project);

          console.log("project", project);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProject();
  }, [projectParams]);

  // loading if project is null
  if (!project) {
    return (
      <>
        <Layout>
          <Loading />
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div className="relative">
        {/* button back and edit */}
        <div className="flex items-center gap-2 fixed">
          <div>
            <Link to="/project">
              <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-red-600 flex gap-3 justify-center items-center">
                <IoChevronBackCircle /> Back
              </button>
            </Link>
          </div>
          <div>
            <Link to={`/updateProject/${newBogParam}`}>
              <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
                <FiEdit /> Edit
              </button>
            </Link>
          </div>
        </div>

        {/* content container */}
        <div className="pt-[50px]">
          <div className="max-w-4xl mx-auto p-10 bg-white shadow-md rounded-lg">
            {/* Cover Image */}
            <div className="mb-6">
              <img
                src={project.coverImage}
                alt={`${project.name} cover`}
                className="w-full h-64 md:h-[320px] object-cover rounded-lg"
              />
            </div>

            {/* Title and Description */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-gray-700">{project.description}</p>
            </div>

            {/* content */}
            <div className="mb-4">
              <ContentDisplay htmlString={project.content} />
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="font-bold text-lg">Location:</h2>
                <p className="text-gray-700">{project.location}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Duration:</h2>
                <p className="text-gray-700">{project.duration} days</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Start Date:</h2>
                <p className="text-gray-700">{formatDate(project.startDate)}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">End Date:</h2>
                <p className="text-gray-700">{formatDate(project.endDate)}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Funds Raised:</h2>
                <p className="text-gray-700">
                  ${project.fundsRaised.toLocaleString()}
                </p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Funding Goal:</h2>
                <p className="text-gray-700">
                  ${project.fundingGoal.toLocaleString()}
                </p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Beneficiaries Count:</h2>
                <p className="text-gray-700">{project.beneficiariesCount}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">Target Group:</h2>
                <p className="text-gray-700">{project.targetGroup}</p>
              </div>
            </div>

            {/* Tags */}
            {/* <div className="mb-6">
              <h2 className="font-bold text-lg">Tags:</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags?.split(",").map((tag, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 border border-green-600 bg-green-500/30 text-green-600 rounded"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div> */}

            {/* Organizers */}
            <div className="mb-6">
              <h2 className="font-bold text-lg">Organizers:</h2>
              <div className="flex items-center gap-5 mt-3 mb-6">
                {project.organizers.map((organizer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 mb-2"
                  >
                    <div className="flex gap-5 flex-col">
                      <div className=" w-[80px] h-[80px]">
                        <img
                          src={organizer.partnerLogo}
                          alt={organizer.name}
                          className={`border-2 rounded-lg cursor-pointer w-full h-full object-contain 
                           `}
                        />
                      </div>
                      <p className="text-center">{organizer.partnerName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Co-Organizers */}
            {project.coOrganizers.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg">Co-Organizers:</h2>
                <div className="flex items-center gap-5 mt-3 mb-6">
                  {project.coOrganizers.map((coOrganizer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2 mb-2"
                    >
                      <div className="flex gap-5 flex-col">
                        <div className=" w-[80px] h-[80px]">
                          <img
                            src={coOrganizer.partnerLogo}
                            alt={coOrganizer.name}
                            className={`border-2 rounded-lg cursor-pointer w-full h-full object-contain 
                       `}
                          />
                        </div>
                        <p className="text-center">{coOrganizer.partnerName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteers */}
            {project.volunteers.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg">Volunteers:</h2>
                <ul className="list-disc pl-5">
                  {project.volunteers.map((volunteer) => (
                    <li key={volunteer.id} className="text-gray-700">
                      {volunteer.name} ({volunteer.role})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Videos */}
            {/* {project.videos.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg">Videos:</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  {project.videos.map((video, index) => (
                    <div key={index} className="w-full">
                      <YoutubeDisplay url={video.url} />
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Images */}
            {project.images.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-lg">Gallery:</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* go to top page */}
      <GoToTop />
    </Layout>
  );
};

export default ProjectDetail;
