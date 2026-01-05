import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [subCategory, setSubCategory] = useState("Smartphones");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/single', { productId: id });
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setDiscountPercentage(product.discountPercentage || 0);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);
        setSizes(product.sizes);
      } else {
        toast.error('Product not found');
        navigate('/list');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        {
          id,
          name,
          description,
          price,
          discountPercentage,
          category,
          subCategory,
          bestseller,
          sizes
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name} 
          className='w-full max-w-[500px] px-3 py-2 border' 
          type="text" 
          placeholder='Type here' 
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea 
          onChange={(e) => setDescription(e.target.value)} 
          value={description} 
          className='w-full max-w-[500px] px-3 py-2 border' 
          placeholder='Write description here' 
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border'>
            <option value="Electronics">Electronics</option>
            <option value="Home">Home & Kitchen</option>
            <option value="Men">Men's Fashion</option>
            <option value="Women">Women's Fashion</option>
            <option value="Books">Books & Media</option>
            <option value="Sports">Sports & Outdoors</option>
            <option value="Beauty">Beauty & Care</option>
            <option value="Automotive">Automotive</option>
            <option value="Pets">Pet Supplies</option>
            <option value="Baby">Baby & Kids</option>
            <option value="Toys">Toys & Games</option>
            <option value="Health">Health & Wellness</option>
            <option value="Office">Office Supplies</option>
            <option value="Garden">Garden & Outdoor</option>
            <option value="Music">Musical Instruments</option>
            <option value="Grocery">Grocery & Gourmet</option>
            <option value="Industrial">Industrial & Scientific</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border'>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Audio">Audio</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product price</p>
          <input 
            onChange={(e) => setPrice(e.target.value)} 
            value={price} 
            className='w-full px-3 py-2 sm:w-[120px] border' 
            type="number" 
            placeholder="25" 
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div key={size} onClick={() => setSizes(prev => 
              prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
            )}>
              <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input 
          onChange={() => setBestseller(prev => !prev)} 
          checked={bestseller} 
          type="checkbox" 
          id='bestseller'
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button className='w-28 py-3 mt-4 bg-black text-white'>UPDATE</button>
    </form>
  );
};

export default Edit;