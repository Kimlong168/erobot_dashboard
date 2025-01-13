import { useEffect, useState, useContext } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { UpdateContext } from "../../contexts/UpdateContext";
import Loading from "../../components/Loading";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const UpdateProductCategory = () => {
  const { id: categoryParam } = useParams();
  const { setIsUpdated } = useContext(UpdateContext);
  const { setShowNotification } = useContext(DataContext);
  const [productCategory, setProductCategory] = useState({
    categoryName: null,
    description: "",
  });

  let navigate = useNavigate();

  //   handle onChange event for input
  const handleOnChange = (e) => {
    setProductCategory({
      ...productCategory,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "product_category", categoryParam);

    // fetch a field of data from firebase by categoryParam to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);
          setProductCategory({
            categoryName: data.categoryName,
            description: data.description,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [categoryParam]);

  //   update category if all required fields are filled
  async function updateCategory() {
    const docRef = doc(db, "product_category", categoryParam);
    await setDoc(
      docRef,
      {
        categoryName: productCategory.categoryName,
        description: productCategory.description,
      },
      { merge: true }
    );

    // to update the data in the table
    setIsUpdated((prev) => !prev);
    navigate("/productCategory");
    setShowNotification({
      status: true,
      item: "product category",
      action: "updated",
    });
    console.log("product category updated");
  }

  // loading until data is fetched
  if (productCategory.categoryName === null) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-gray-900  border-gray-900 mt-6 rounded">
        {/* title */}
        <div className="text-center p-4 font-bold text-3xl text-yellow-400 underline uppercase">
          Update Product Category
        </div>
        <br />
        {/* update form */}
        <section className="pt-0">
          {/* category name */}
          <label className="font-bold text-xl">
            Category Name
            <RedStar />
          </label>
          <input
            type="text"
            name="categoryName"
            placeholder="Title eg(CPL, Laliga, EPL, AFC-Cup,...)"
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            value={productCategory.categoryName}
            onChange={(e) => handleOnChange(e)}
          />

          {/* descriptiom */}
          <label className="font-bold text-xl">Description</label>
          <textarea
            name="description"
            placeholder="Write something to describe this category or don't write any thing (optional)"
            rows={4}
            className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
            type="text"
            value={productCategory.description}
            onChange={(e) => handleOnChange(e)}
          />

          {/* update button */}
          <button
            className="bg-gray-700 w-full  text-white font-bold p-2 mt-2 rounded"
            onClick={
              productCategory.categoryName.length !== 0
                ? updateCategory
                : notify
            }
          >
            Update Category
          </button>

          {/* toast alert */}
          <Toast />

          {/* button back */}
          <ButtonBack link="/productCategory" />
        </section>
      </div>
    </Layout>
  );
};

export default UpdateProductCategory;
