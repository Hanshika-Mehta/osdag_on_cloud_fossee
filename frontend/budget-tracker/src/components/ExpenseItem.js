import React ,{useContext, useState , useEffect}from "react";
import {TiDelete} from "react-icons/ti";
import { AppContext } from "../context/AppContext";
// import { useParams } from "react-router-dom";
import axios from 'axios';

const ExpenseItem = (props) => {
    const {dispatch} = useContext(AppContext);
    const [product, setProduct] = useState("");
        // product='';
        
    //     useEffect(() => {
    //         getSingleItem();
    // }, []);
        // const {  } = useParams();
        const user_id = parseInt(localStorage.getItem("user_id"))
    
        

    useEffect(()=>{
        const getSingleItem = async () => {
            const { data } = await axios.get(`http://127.0.0.1:8000/api/user/${user_id}`)
            console.log(data)
            alert(data);
            setProduct(data)
            console.log(product);
        }
        getSingleItem();
    },[]);

    // const ItemDetails = () => {
        
    //     getSingleItem();
        
    // }

    const handleDeleteExpense = () => {
        dispatch({
            type: 'DELETE_EXPENSE',
            payload: props.id,
        });
    }
    return(
        <li className="list-group-item d-flex justify-content-between align-items-center">
        {props.name}
        <div>
            <span className="btn btn-primary" > Rs {props.cost}</span>
            <TiDelete size="1.5rem" onClick={handleDeleteExpense}></TiDelete>
        </div>
        </li>
    );
};



    // return (
    //     <div>
    //     <h1>Product Detail</h1>
    //     <div className="single-product-info">
    //     <p>{product.name}</p>
    //    console.log("hi1");
    //     </div>
    //     </div>
    // )


export default ExpenseItem;

