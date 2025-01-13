import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const CreateBlogCategory = () => {
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [blogCategory, setblogCategory] = useState({
    categoryName: null,
    description: "",
  });

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "blog_category");

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setblogCategory({
      ...blogCategory,
      [e.target.name]: e.target.value,
    });
  };

  //   create category fucntion
  const createCategory = () => {
    addDoc(postCollectionRef, {
      categoryName: blogCategory.categoryName,
      description: blogCategory.description,
    });

    console.log("Blog category created!", blogCategory.categoryName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "blog category",
      action: "created",
    });
    navigate("/blogCategory");
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-pink-600 underline uppercase">
          Create Blog Category
        </div>
        <br />

        {/* create product categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* category name input */}
            <label className="font-bold text-xl">
              Category Name
              <RedStar />
            </label>
            <input
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="categoryName"
              value={blogCategory.categoryName}
              onChange={(e) => handleOnChange(e)}
            />

            {/* description input */}
            <label className="font-bold text-xl">Description</label>
            <textarea
              placeholder="Write something to describe this category or don't write any thing (optional)"
              rows={4}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={blogCategory.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/*check if categoryName is not filled yet. */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                blogCategory.categoryName !== null ? createCategory : notify
              }
            >
              Create Category
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/blogCategory" />
      </div>
    </Layout>
  );
};

export default CreateBlogCategory;
