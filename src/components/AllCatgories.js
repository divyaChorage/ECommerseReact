import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AllCategories = () => {

    const navigate = useNavigate();
    const { id } = useParams(); 
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCategories();
    }, [id]);

    const getAllCategories = async () => {
        try {

            const response = await fetch(`http://127.0.0.1:5000/product/${id}/addCategory/AllCatgories`);
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const result = await response.json();
            console.log("getting all cate____",result)
            setCategories(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const deleteCategory = async (cateId) => { 
        console.log(cateId,"  categid "," id",id)
        try {

            const response = await fetch(`http://127.0.0.1:5000/addCategory/${id}/AllCategories/${cateId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setCategories(categories.filter(cat => cat._id !== cateId));
            } else {
                console.error("Failed to delete the category");
            }
        } catch (error) {
            console.error("Error occurred while deleting the category", error);
        }
    };
    
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="product-table">
            {categories.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category Name</th>
                            <th>Price</th>
                            <th>quality</th>
                            <th>description</th>
                     
                     
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.category}</td>
                                <td>{item.price}</td>
                               
                                <td>{item.quality}</td>
                                <td>{item.description}</td>
                                {console.log(`${item.image}`)}
                                <td>
                                    {item.image ? (
                                
                                <img
                                src={`http://localhost:5000/uploadCate/${item.image.split('\\').pop()}`}  // Extract the filename
                                alt={item.name}
                                style={{ width: '50px', height: '50px' }}
                            />
                          ) : (
                                        <p>No image available</p>
                                    )}
                                </td>

                  <button onClick={()=>deleteCategory(item._id)}>Delete</button>
                  <button
    className="update-button"
    onClick={() => navigate(`/UpdateCategories/${id}/${item._id}`)}
>
    Update
</button>

                            </tr>

                            
                        ))}
                    </tbody>


                </table>
            ) : (
                <p>No categories available for this product.</p>
            )}



          
        </div>
    );
};

export default AllCategories;
