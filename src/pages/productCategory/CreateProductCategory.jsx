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
const CreateProductCategory = () => {
  const [productCategory, setProductCategory] = useState({
    categoryName: null,
    description: "",
  });
  let navigate = useNavigate();
  const postCollectionRef = collection(db, "product_category");

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setProductCategory({
      ...productCategory,
      [e.target.name]: e.target.value,
    });
  };

  //   create category fucntion
  const createCategory = () => {
    addDoc(postCollectionRef, {
      categoryName: productCategory.categoryName,
      description: productCategory.description,
    });

    console.log("Product category created!", productCategory.categoryName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    setShowNotification({
      status: true,
      item: "product category",
      action: "created",
    });
    navigate("/productCategory");
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-yellow-400 underline uppercase">
          Create Product Category
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
              value={productCategory.categoryName}
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
              value={productCategory.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/*check if categoryName is not filled yet. */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                productCategory.categoryName !== null ? createCategory : notify
              }
            >
              Create Category
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/productCategory" />
      </div>
    </Layout>
  );
};

export default CreateProductCategory;
