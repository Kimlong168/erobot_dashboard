import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PropTypes from "prop-types";
import "../App.css";
import { useState } from "react";
const CKeditor = ({
  handleEditorChange,
  contentToUpdate,
  imageFolderName = "blogImages",
}) => {
  const [content, setContent] = useState(contentToUpdate || "");
  // this function is used to upload images in the content of each blog post to firebase storage
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);

            const imageRef = ref(storage, `${imageFolderName}/${file.name}`);
            uploadBytes(imageRef, file).then(() => {
              // Get the download URL for the uploaded image
              getDownloadURL(imageRef)
                .then((downloadURL) => {
                  console.log("image URL:", downloadURL);

                  // Save the image reference in the state
                  // setImageReferences((prevReferences) => ({
                  //   ...prevReferences,
                  //   [downloadURL]: imageRef,
                  // }));

                  // resolve the promise with the result object
                  resolve({
                    default: downloadURL,
                  });
                })
                .catch((error) => {
                  reject(error);
                  console.error("Error getting download URL:", error);
                });
              console.log("blog image uploaded");
            });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="prose prose-h1:m-0 prose-h2:m-0 prose-h3:m-0 prose-p:m-0 prose-p:mt-2 prose-a:text-blue-500 prose-a:cursor-pointer max-w-full">
      <CKEditor
        id="editor"
        className="editor"
        config={{
          extraPlugins: [uploadPlugin],
        }}
        editor={ClassicEditor}
        data={content}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
          handleEditorChange(data);
          console.log("edior:", { event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
};
CKeditor.propTypes = {
  handleEditorChange: PropTypes.func.isRequired,
  contentToUpdate: PropTypes.string,
  imageFolderName: PropTypes.string.isRequired,
};
export default CKeditor;
