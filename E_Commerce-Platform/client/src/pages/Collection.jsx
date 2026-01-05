import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const {products, search, setSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev => prev.filter(item => item !== e.target.value));
    }
    else{
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    }
    else{
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  }

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSearch('');
    setPriceRange('all');
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    if(search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if(subCategory.length > 0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    
    // Apply price filter
    if(priceRange !== 'all'){
      switch(priceRange){
        case '0-150':
          productsCopy = productsCopy.filter(item => item.price < 150);
          break;
        case '150-250':
          productsCopy = productsCopy.filter(item => item.price >= 150 && item.price < 250);
          break;
        case '250-350':
          productsCopy = productsCopy.filter(item => item.price >= 250 && item.price < 350);
          break;
        case '350+':
          productsCopy = productsCopy.filter(item => item.price >= 350);
          break;
      }
    }
    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }
  
  useEffect(()=>{
    applyFilter();
  }, [category, subCategory, search, products, priceRange])
  
  useEffect(()=>{
    sortProduct();
  }, [sortType])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'ALL'} text2={'PRODUCTS'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover our complete collection of premium products
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
              {/* Filter Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <span>🔍</span> FILTERS
                  </h3>
                  <button 
                    onClick={()=>setShowFilter(!showFilter)}
                    className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <span className={`text-lg transition-transform ${showFilter ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                </div>
              </div>
              
              <div className={`p-6 space-y-6 ${showFilter ? 'block' : 'hidden'} lg:block`}>
                {/* Search Bar */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    SEARCH
                  </h4>
                  <div className="relative">
                    <input 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      type="text" 
                      placeholder="Search products..."
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    PRICE RANGE
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'All Prices', value: 'all' },
                      { label: 'Under ₹150', value: '0-150' },
                      { label: '₹150 - ₹250', value: '150-250' },
                      { label: '₹250 - ₹350', value: '250-350' },
                      { label: 'Over ₹350', value: '350+' }
                    ].map((price, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input 
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                          type="radio" 
                          name="price" 
                          value={price.value} 
                          checked={priceRange === price.value}
                          onChange={handlePriceChange}
                        />
                        <span className="text-sm text-gray-700">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    CATEGORIES
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: '📱 Electronics', value: 'Electronics' },
                      { label: '🏠 Home & Kitchen', value: 'Home' },
                      { label: '👔 Men', value: 'Men' },
                      { label: '👗 Women', value: 'Women' },
                      { label: '👶 Kids', value: 'Kids' }
                    ].map((cat, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" type="checkbox" onChange={toggleCategory} value={cat.value}/>
                        <span className="text-sm text-gray-700">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Subcategories */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    TYPE
                  </h4>
                  <div className="space-y-2">
                    {/* Electronics Subcategories */}
                    {category.includes('Electronics') && [
                      { label: '💻 Laptops', value: 'Laptops' },
                      { label: '📱 Smartphones', value: 'Smartphones' },
                      { label: '🎧 Audio', value: 'Audio' },
                      { label: '📺 TV', value: 'TV' },
                      { label: '📷 Cameras', value: 'Cameras' },
                      { label: '📟 Tablets', value: 'Tablets' }
                    ].map((type, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" type="checkbox" onChange={toggleSubCategory} value={type.value}/>
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                    
                    {/* Fashion Subcategories */}
                    {(category.includes('Men') || category.includes('Women') || category.includes('Kids')) && [
                      { label: '👕 Topwear', value: 'Topwear' },
                      { label: '👖 Bottomwear', value: 'Bottomwear' },
                      { label: '👟 Footwear', value: 'Footwear' },
                      { label: '🧥 Winterwear', value: 'Winterwear' }
                    ].map((type, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" type="checkbox" onChange={toggleSubCategory} value={type.value}/>
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                    
                    {/* Home & Kitchen Subcategories */}
                    {category.includes('Home') && [
                      { label: '🍳 Kitchen', value: 'Kitchen' },
                      { label: '🧹 Cleaning', value: 'Cleaning' },
                      { label: '🏠 Smart Home', value: 'Smart Home' }
                    ].map((type, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" type="checkbox" onChange={toggleSubCategory} value={type.value}/>
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                    
                    {/* Show all subcategories if no category is selected */}
                    {category.length === 0 && [
                      'Topwear', 'Bottomwear', 'Winterwear'
                    ].map((type, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <input className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" type="checkbox" onChange={toggleSubCategory} value={type}/>
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters */}
                <button 
                  onClick={clearAllFilters}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Products Section */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                  <p className="text-gray-600">{filterProducts.length} items found</p>
                </div>
                <select 
                  onChange={(e)=>setSortType(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="relevant">Sort by: Relevant</option>
                  <option value="low-high">Sort by: Low to High</option>
                  <option value="high-low">Sort by: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {filterProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterProducts.map((item, index)=>(
                    <div key={index} className="group">
                      <ProductItem name={item.name} id={item._id} price={item.price} image={item.images || item.image} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection;
