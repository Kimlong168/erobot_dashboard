import { useEffect, useState, useContext } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { UpdateContext } from "../../contexts/UpdateContext";
import Loading from "../../components/Loading";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
import CKeditor from "../../components/CKeditor";
const UpdateProduct = () => {
  const { id: productParams } = useParams();
  const { productCategoryList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);
  const [product, setProduct] = useState({
    name: null,
    description: "",
    detail: "",
    price: "",
    productCode: "",
    image: "",
    imageId: "",
    isActive: "",
    categoryId: "",
  });

  const [oldImageUrl, setOldImageUrl] = useState(null);

  let navigate = useNavigate();

  //   hadle onChange event for CKEditor
  const handleEditorChange = (content) => {
    setProduct({
      ...product,
      detail: content,
    });
  };

  //   handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "image") {
      setProduct({
        ...product,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const docRef = doc(db, "products", productParams);

    // fetch a field of data from firebase by productParams to update
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("data", data);

          // check if the category no longer exist
          let categoryId = productCategoryList.map((data) => data.id)[0];

          productCategoryList.forEach((element) => {
            if (element.id === data.categoryId) {
              categoryId = data.categoryId;
              return;
            }
          });

          setProduct({
            name: data.name,
            description: data.description,
            detail: data.detail,
            price: data.price,
            productCode: data.productCode,
            isActive: data.isActive,
            categoryId: categoryId,
            imageId: data.imageId,
            // no need to get image
            image: null,
          });

          // get old image url
          setOldImageUrl(data.image);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [productParams, productCategoryList]);

  //   update product if all required fields are filled
  async function updateProduct() {
    // navigate to product detail page in advance
    navigate("/productDetail/update-" + productParams);

    const docRef = doc(db, "products", productParams);

    // if image is not updated
    if (product.image === null) {
      await setDoc(
        docRef,
        {
          name: product.name,
          description: product.description,
          detail: product.detail,
          price: product.price,
          productCode: product.productCode,
          imageId: product.imageId,
          image: oldImageUrl,
          // convert string to boolean
          isActive:
            typeof product.isActive === "string"
              ? JSON.parse(product.isActive.toLowerCase())
              : product.isActive,
          categoryId: product.categoryId,
        },
        { merge: true }
      );
    } else {
      // if image is updated

      // remove the old image from the storage
      const storageRef = ref(storage, `productImages/${product.imageId}`);
      deleteObject(storageRef)
        .then(() => {
          // File deleted successfully
          console.log(product.name, "image deleted successfully");
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });

      // upload new image to the storage, get the image url and update the data in the firestore
      const imageRef = ref(storage, `productImages/${product.imageId}`);
      uploadBytes(imageRef, product.image).then(() => {
        // Get the download URL for the uploaded image
        getDownloadURL(imageRef)
          .then((downloadURL) => {
            console.log("new image URL:", downloadURL);
            // update data in the firestore with a new image url and new data
            updateProductAndNewImage(downloadURL);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });

        console.log("new product image uploaded");
      });
    }
    // to update the data in the table
    setIsUpdated((prev) => !prev);
    // set isAdded to true to display notification
    setShowNotification({
      status: true,
      item: "product",
      action: "updated",
    });

    console.log("product updated");
  }

  // if the image is updated, update the image url in the firestore. this function is called in updateProduct function because we need to get the new image url first
  async function updateProductAndNewImage(newImageUrl) {
    const docRef = doc(db, "products", productParams);
    await setDoc(
      docRef,
      {
        name: product.name,
        description: product.description,
        detail: product.detail,
        price: product.price,
        productCode: product.productCode,
        imageId: product.imageId,
        // new image url
        image: newImageUrl,
        // convert string to boolean
        isActive:
          typeof product.isActive === "string"
            ? JSON.parse(product.isActive.toLowerCase())
            : product.isActive,
        categoryId: product.categoryId,
      },
      { merge: true }
    );
  }

  // loading until data is fetched
  if (product.name === null) {
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
        <div className="text-center p-4 font-bold text-3xl text-red-600 underline uppercase">
          Update Product
        </div>
        <br />

        {/* update product form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* product name input */}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Product Name
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              {/* product image url input */}
              <div className="w-full">
                <label className="font-bold text-xl">Product Image</label>
                <input
                  className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
                  type="file"
                  name="image"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* category input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Category</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="categoryId"
                  value={product.categoryId}
                  onChange={(e) => handleOnChange(e)}
                >
                  {productCategoryList &&
                    productCategoryList.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.categoryName}
                      </option>
                    ))}
                </select>
              </div>
              {/* isActive input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Status</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="isActive"
                  value={product.isActive}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* product price input */}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Price ($)
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              {/* product code input */}
              <div className="w-full">
                <label className="font-bold text-xl">Product Code</label>
                <input
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                  type="text"
                  name="productCode"
                  value={product.productCode}
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </div>

            {/* description input */}
            <label className="font-bold text-xl">
              Description
              <RedStar />
            </label>
            <textarea
              placeholder="Write something to describe this product "
              rows={3}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={product.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/* product detail input */}
            <label className="font-bold text-xl">Detail</label>
            {/* ckeditor */}
            <div>
              <CKeditor
                handleEditorChange={handleEditorChange}
                contentToUpdate={product.detail}
                imageFolderName="productDetailImages"
              />
            </div>

            {/* update button */}
            <button
              className="bg-gray-700 w-full  text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                product.name && product.description && product.price
                  ? updateProduct
                  : notify
              }
            >
              Update Product
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/product" />
      </div>
    </Layout>
  );
};

export default UpdateProduct;
