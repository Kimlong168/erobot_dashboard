import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
import CKeditor from "../../components/CKeditor";
// import JoditEditor from "jodit-react";
const CreateProduct = () => {
  const { productCategoryList, setShowNotification } = useContext(DataContext);
  const { setIsUpdated } = useContext(UpdateContext);
  //  set default category
  const category = productCategoryList.map((data) => data.id)[0];

  // state
  const [product, setProduct] = useState({
    name: null,
    description: "",
    detail: "",
    price: "",
    image: "",
    productCode: "",
    isActive: "true",
    categoryId: category,
  });

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "products");

  // jodit text editor
  // const editor = useRef(null);
  // const config = {
  //   readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //   placeholder: "Write more detail about this product...",
  // };

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

  //   create product fucntion
  const createProduct = (imageUrl, imageId) => {
    addDoc(postCollectionRef, {
      name: product.name,
      description: product.description,
      detail: product.detail,
      price: product.price,
      productCode: product.productCode,
      image: imageUrl,
      imageId: imageId,

      // convert string to boolean because the value we get from the select form is string.
      isActive:
        typeof product.isActive === "string"
          ? JSON.parse(product.isActive.toLowerCase())
          : product.isActive,
      categoryId: product.categoryId,
    });

    console.log("Product created!", product.categoryName);
    // to update the data in the table
    setIsUpdated((prev) => !prev);

    // set isAdded to true to display notification
    setShowNotification({
      status: true,
      item: "product",
      action: "created",
    });
  };

  // upload image to firebase storage
  const uploadImageAndCreateProduct = () => {
    // navigate to product page in advance
    navigate("/product");

    // Concatenate full name and timestamp to create the ID
    const productNameNoSpaces = product.name.replace(/\s+/g, "");
    const timestamp = new Date().getTime();
    const imageId = `${productNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `productImages/${imageId}`);
    uploadBytes(imageRef, product.image).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("image URL:", downloadURL);
          createProduct(downloadURL, imageId);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });

      console.log("product image uploaded");
    });
  };

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-red-600 underline uppercase">
          Create Product
        </div>
        <br />

        {/* create product categort form */}
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
                <label className="font-bold text-xl">
                  Product Image
                  <RedStar />
                </label>
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
                  {productCategoryList.map((data) => (
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
                imageFolderName="productDetailImages"
              />
            </div>

            {/* <div>
              <JoditEditor
                ref={editor}
                value={product.detail}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {
                  setProduct({
                    ...product,
                    detail: newContent,
                  });
                }} // preferred to use only this option to update the content for performance reasons
                // onChange={(newContent) => setContent(newContent)}
              />
            </div> */}

            {/*create product button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                product.name &&
                product.description &&
                product.price &&
                product.image
                  ? uploadImageAndCreateProduct
                  : notify
              }
            >
              Create Product
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

export default CreateProduct;
