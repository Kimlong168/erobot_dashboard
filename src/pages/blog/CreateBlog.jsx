import { useState, useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Layout from "../../layouts/Layout";
import notify from "../../utils/Notify";
import Toast from "../../utils/Toast";
import { UpdateContext } from "../../contexts/UpdateContext";
import CKEditor from "../../components/CKeditor";
import getCurrentDate from "../../utils/getCurrentDate";
import formatDate from "../../utils/fomatDate";
import RedStar from "../../components/RedStar";
import ButtonBack from "../../components/ButtonBack";
import { DataContext } from "../../contexts/DataContext";
const CreateBlog = () => {
  const { blogCategoryList, authorList, setShowNotification } =
    useContext(DataContext);
  //  set default category
  const category = blogCategoryList.map((data) => data.id)[0];
  // const [imageReferences, setImageReferences] = useState({});
  // state
  const [blog, setBlog] = useState({
    title: null,
    description: "",
    content: "",
    coverImage: "",
    publicationDate: getCurrentDate(),
    isActive: "true",
    categoryId: category,
    authorId: "default",
  });

  let navigate = useNavigate();
  const postCollectionRef = collection(db, "blogs");

  //   update context
  const { setIsUpdated } = useContext(UpdateContext);

  //   handle onChange event for input
  const handleOnChange = (e) => {
    // check if the input is image
    if (e.target.name === "coverImage") {
      setBlog({
        ...blog,
        [e.target.name]: e.target.files[0],
      });
      return;
    }

    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  //   hadle onChange event for CKEditor
  const handleEditorChange = (content) => {
    setBlog({
      ...blog,
      content: content,
    });
  };

  //   create blog fucntion
  const CreateBlog = (imageUrl, imageId) => {
    addDoc(postCollectionRef, {
      title: blog.title,
      description: blog.description,
      content: blog.content,
      coverImage: imageUrl,
      coverImageId: imageId,
      publicationDate: formatDate(blog.publicationDate),
      categoryId: blog.categoryId,
      authorId: blog.authorId,
      // convert string to boolean because the value we get from the select form is string.
      isActive:
        typeof blog.isActive === "string"
          ? JSON.parse(blog.isActive.toLowerCase())
          : blog.isActive,
    });
    // to update the data in the table
    setIsUpdated((prev) => !prev);

    // set isAdded to true to display notification
    setShowNotification({
      status: true,
      item: "blog",
      action: "created",
    });

    console.log("Blog created!", blog.categoryName);

    // const imagesInContent = blog.content.match(/<img[^>]+src="[^"]+"[^>]*>/g);
    // remove the image from storage if the image is removed from the content
    // handleImageRemove(imagesInContent);
  };

  // upload image to firebase storage
  const uploadImageAndCreateBlog = () => {
    // navigate to blog page in advance
    navigate("/blog");

    // Concatenate full name and timestamp to create the ID
    const blogNameNoSpaces = blog.title.replace(/\s+/g, "");
    const timestamp = new Date().getTime();
    const imageId = `${blogNameNoSpaces}_${timestamp}`;

    const imageRef = ref(storage, `blogCoverImages/${imageId}`);
    uploadBytes(imageRef, blog.coverImage).then(() => {
      // Get the download URL for the uploaded image
      getDownloadURL(imageRef)
        .then((downloadURL) => {
          console.log("blog cover image URL:", downloadURL);
          //   store blog and image to firestore database
          CreateBlog(downloadURL, imageId);
        })
        .catch((error) => {
          console.error("Error getting download URL:", error);
        });

      console.log("blog image uploaded");
    });
  };

  // const handleImageRemove = (imagesInContent) => {
  //   // imagesSrc is an array of URLs of the images being removed

  //   const imageUrls = imagesInContent.map((imgTag) => {
  //     const match = imgTag.match(/src="([^"]+)"/);
  //     return match ? match[1] : null;
  //   });

  //   imageUrls.forEach((imageUrl) => {
  //     // Get the corresponding image reference from the state
  //     // const imageRef = imageReferences[imageUrl];
  //     const imageRef = true;

  //     if (!imageRef) {
  //       // Delete the image from Firebase Storage
  //       deleteObject(imageRef)
  //         .then(() => {
  //           console.log("Image deleted from storage:", imageUrl);
  //         })
  //         .catch((error) => {
  //           console.error("Error deleting image from storage:", error);
  //         });
  //     }
  //   });
  // };

  // useEffect(() => {
  //   // Clean up imageReferences when the component unmounts
  //   return () => {
  //     Object.values(imageReferences).forEach((imageRef) => {
  //       // Delete any remaining images from Firebase Storage
  //       deleteObject(imageRef)
  //         .then(() => {
  //           console.log("Image deleted from storage during cleanup");
  //         })
  //         .catch((error) => {
  //           console.error(
  //             "Error deleting image from storage during cleanup:",
  //             error
  //           );
  //         });
  //     });
  //   };
  // }, [imageReferences]);

  return (
    <Layout>
      <div className="text-gray-900  border-gray-700 rounded">
        {/* title */}
        <div className="text-center p-4 pt-0 font-bold text-3xl text-violet-600 underline uppercase">
          Create Blog Post
        </div>
        <br />

        {/* create blog categort form */}
        <div className="bg-errorPage bg-no-repeat bg-cover bg-fixed bg-bottom  ">
          <div className="w-full flex flex-col  border border-white/50 rounded-3xl ">
            {/* blog title input */}
            <div className="w-full">
              <label className="font-bold text-xl">
                Blog Title
                <RedStar />
              </label>
              <input
                className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
                type="text"
                name="title"
                value={blog.title}
                onChange={(e) => handleOnChange(e)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* category input */}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Category</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="categoryId"
                  value={blog.categoryId}
                  onChange={(e) => handleOnChange(e)}
                >
                  {blogCategoryList.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* author input*/}
              <div className="w-full">
                <label className="font-bold mb-2 text-xl">Author</label>
                <select
                  className="border border-gray-700 p-2 rounded w-full outline-none mb-5 cursor-pointer"
                  name="authorId"
                  value={blog.authorId}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={`default`}>Admin</option>
                  {authorList.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.fullName}
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
                  value={blog.isActive}
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-3 items-center">
              {/* blog image url input */}
              <div className="w-full">
                <label className="font-bold text-xl">
                  Cover Image
                  <RedStar />
                </label>
                <input
                  className="border border-gray-700 p-1.5 rounded w-full outline-none mb-5"
                  type="file"
                  name="coverImage"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              {/* publish date */}
              <div className="w-full">
                <label className="font-bold text-xl">Publish Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  className="border border-gray-700  uppercase p-2 rounded w-full outline-none mb-5 cursor-pointer block"
                  value={blog.publicationDate}
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
              placeholder="Write something to describe this blog "
              rows={3}
              className="border border-gray-700 p-2 rounded w-full outline-none mb-5"
              type="text"
              name="description"
              value={blog.description}
              onChange={(e) => handleOnChange(e)}
            />

            {/* blog Content or body input */}
            <label className="font-bold text-xl">
              Content
              <RedStar />
            </label>
            <div>
              <CKEditor
                handleEditorChange={handleEditorChange}
                imageFolderName="blogImages"
                // setImageReferences={setImageReferences}
              />
            </div>

            {/*create blog button */}
            <button
              className="bg-gray-700 text-white font-bold p-2 mt-2 rounded"
              onClick={
                // check if all required input is filled
                blog.title &&
                blog.description &&
                blog.content &&
                blog.coverImage
                  ? uploadImageAndCreateBlog
                  : notify
              }
            >
              Create Blog
            </button>
          </div>
        </div>

        {/* toast alert */}
        <Toast />

        {/* button back */}
        <ButtonBack link="/blog" />
      </div>
    </Layout>
  );
};

export default CreateBlog;
