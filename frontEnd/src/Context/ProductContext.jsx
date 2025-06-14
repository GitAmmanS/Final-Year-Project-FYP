import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../utils/BaseUrl";
export const ProductContext = createContext();

const ProductContextProvider = (props) => {
    const [productData, getProductData] = useState([]);
    const [storeData, setStoreData] = useState([]);
    useEffect(() => {
        const getProduct = async () => {
            axios.get(`${BaseUrl}/product`).then((response) => {
                getProductData(response.data.data);
            })
        }
        getProduct();
    }, [productData])

     useEffect(() => {
            const fetchData = async () => {
                try {
                    const storeResponse = await axios.get(`${BaseUrl}/store`);
                    setStoreData(storeResponse.data.data);
                } catch (err) {
                    console.error(err.message);
                }
            };
    
            fetchData();
        }, [storeData]);

    const value ={
        productData,
        storeData
    }

    return(
        <ProductContext.Provider value={value}>
            {props.children}
        </ProductContext.Provider>
    )
}
export default ProductContextProvider