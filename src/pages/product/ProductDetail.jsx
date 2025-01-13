import { useContext, useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Loading from "../../components/Loading";
import ProductDetailCard from "./ProductDetailCard";
import { DataContext } from "../../contexts/DataContext";

const ProductDetail = () => {
  const { id: productParams } = useParams();
  const { productCategoryList } = useContext(DataContext);

  const [product, setProduct] = useState(null);
  // to store id without update- text after updating 
  const [newProductParam, setNewProductParam] = useState(productParams);

  // fetch product base on id or productParams
  useEffect(() => {
    // check if the productParams is update-xxxx (after updating)
    const match = productParams.match(/update-(.+)/);
    // Check if there is a match and retrieve the id
    const newProductParams = match ? match[1] : productParams;
    setNewProductParam(newProductParams);

    const docRef = doc(db, "products", newProductParams);
    const fetchProduct = async () => {
      try {
        // if we view the detail after updating we delay 1000 to make sure data is fetched successfully
        if (match) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const product = docSnap.data();

          setProduct(product);

          console.log("product", product);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProduct();
  }, [productParams]);

  // loading if product is null
  if (!product) {
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
      <div>
        {/* product detail card component */}
        <ProductDetailCard
          {...product}
          productParams={newProductParam}
          productCategoryList={productCategoryList}
        />
      </div>

  
    </Layout>
  );
};

export default ProductDetail;
