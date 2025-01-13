import { useContext, useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { FiEdit } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import Loading from "../../components/Loading";
import { GrStatusInfo } from "react-icons/gr";
import ContentDisplay from "../../components/ContentDisplay";
import GoToTop from "../../components/GoToTop";
import { DataContext } from "../../contexts/DataContext";
const BlogDetail = () => {
  const { id: blogParams } = useParams();
  const { blogCategoryList, authorList } =
    useContext(DataContext);
  const [blog, setblog] = useState(null);
  const [newBogParam, setNewBogParam] = useState(blogParams);

  // fetch blog base on id or blogParams
  useEffect(() => {
    // check if the blogParams is update-xxxx (after updating)
    const match = blogParams.match(/update-(.+)/);
    // Check if there is a match and retrieve the id
    const newBogParams = match ? match[1] : blogParams;
    setNewBogParam(newBogParams);

    const docRef = doc(db, "blogs", newBogParams);

    const fetchblog = async () => {
      try {
        // if we view the detail after updating we delay 1000 to make sure data is fetched successfully
        if (match) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blog = docSnap.data();

          setblog(blog);

          console.log("blog", blog);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchblog();
  }, [blogParams]);

  // loading if blog is null
  if (!blog) {
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
            <Link to="/blog">
              <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-red-600 flex gap-3 justify-center items-center">
                <IoChevronBackCircle /> Back
              </button>
            </Link>
          </div>
          <div>
            <Link to={`/updateBlog/${newBogParam}`}>
              <button className="px-4 py-1.5 rounded hover:shadow-xl text-white font-bold bg-green-600 flex gap-3 justify-center items-center">
                <FiEdit /> Edit
              </button>
            </Link>
          </div>
        </div>

        {/* content container */}
        <div className="pt-[50px]">
          <div className="prose lg:prose-xl prose-img:w-full lg:prose-img:w-auto prose-img:mx-auto prose-img:block prose-a:text-blue-600 prose-a:hover:text-blue-400 rounded mx-auto bg-gray-100 border w-full font-khmer p-2 md:p-5">
            <h3>{blog.title}</h3>
            <div>{blog.description}</div>

            <div className="flex flex-col md:flex-row   md:justify-center md:items-center gap-5 p-4 mt-5 rounded bg-gray-500 text-white ">
              <div className="flex items-center gap-2" title="Publish date">
                <MdDateRange />
                {blog.publicationDate}
              </div>
              <div className="flex items-center gap-2" title="Author">
                <FaUser />

                {blog.authorId == "default"
                  ? "Admin"
                  : authorList.map((data) => {
                      if (data.id == blog.authorId) {
                        return data.fullName;
                      }
                    })}
              </div>
              <div className="flex items-center gap-2" title="Categorty">
                <TbCategory2 />

                {blogCategoryList.map((data) => {
                  if (data.id == blog.categoryId) {
                    return data.categoryName;
                  }
                })}
              </div>
              <div className="flex items-center gap-2" title="Status">
                <GrStatusInfo />
                {blog.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <div>
              <img
                src={blog.coverImage}
                alt="blog image"
                title="Cover Image"
                loading="lazy"
              />
            </div>

            {/* Use dangerouslySetInnerHTML to render HTML content */}
            <ContentDisplay htmlString={blog.content} />
          </div>
        </div>
      </div>
      {/* go to top page */}
      <GoToTop />
    </Layout>
  );
};

export default BlogDetail;
