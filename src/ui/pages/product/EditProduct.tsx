import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { 
  Package, 
  DollarSign, 
  Barcode, 
  ArrowLeft, 
  Save, 
  FileText,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import ProductMediaBox from "./components/ProductMediaBox";
import { round2 } from "../../utils/Round2";

interface ProductData {
  id: number | null;
  productImage: File | null;
  name: string;
  description: string;
  cost_price: string;
  retail_price_incl_vat: string;
  sku: string;
  part_number: string;
  quantity: string;
  image: string;
}




const EditProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  const productInitialState: ProductData = {
    id: null,
    productImage: null,
    name: "",
    description: "",
    cost_price: "",
    retail_price_incl_vat: "",
    sku: "",
    part_number: "",
    quantity: "",
    image: "",
  };

  const [product, setProduct] = useState<ProductData>(productInitialState);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProductById(params.productId);
      console.log(response)
      setProduct(response);
    } catch (error) {
      toast.error("Failed to load product details. Please try again.", {
        position: "top-center",
      });
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };
  const VAT_RATE = 0.05;


  const getRetailExVat = () => {
      const retailIncl = parseFloat(product.retail_price_incl_vat);
      if (!retailIncl || retailIncl <= 0) return 0;
      return retailIncl / (1 + VAT_RATE);
    };
  
    // const getVatAmount = () => {
    //   const retailIncl = parseFloat(product.retailPrice);
    //   if (!retailIncl || retailIncl <= 0) return 0;
    //   return retailIncl - getRetailExVat();
    // };
  
    const calculateMarginExVat = () => {
      const cost = parseFloat(product.cost_price);
      const retailExVat = getRetailExVat();
  
      if (!cost || !retailExVat || retailExVat <= 0) return "0";
      return (((retailExVat - cost) / retailExVat) * 100).toFixed(1);
    };
  
      const calculateMarginIncVat = () => {
      const cost = parseFloat(product.cost_price);
      const retailIncVat = parseFloat(product.retail_price_incl_vat);
  
      if (!cost || !retailIncVat || retailIncVat <= 0) return "0";
      return (((retailIncVat - cost) / retailIncVat) * 100).toFixed(1);
    };
  
  const calculateRetailExVat = () => {
    const retailIncl = Number(product.retail_price_incl_vat);
    if (!retailIncl || retailIncl <= 0) return 0;
    return round2(retailIncl / 1.05);
  };
  
  const calculateVatAmount = () => {
    const retailIncl = Number(product.retail_price_incl_vat);
    if (!retailIncl || retailIncl <= 0) return 0;
    return round2(retailIncl - retailIncl / 1.05);
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProduct((prev) => ({
        ...prev,
        productImage: event.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("gear-square-user"));
      const productData = {
        ...product,
        updatedBy: user.id,
        productImage: product.productImage
          ? {
              buffer: await product.productImage.arrayBuffer(),
              imageName: product.productImage.name,
            }
          : null,
      };
      //@ts-ignore
      const response = await window.electron.updateProductDetails(productData);
      
      if (response.success) {
        toast.success("Product updated successfully", { position: "top-center" });
        navigate("/product");
      } else {
        toast.error("Failed to update product", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate("/product")}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-0.5">Update product information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Product Information</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-gray-400" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleInputChange}
                    value={product.name}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                    rows={4}
                    onChange={handleInputChange}
                    value={product.description}
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
                  </div>
                  {product.cost_price && product.retail_price_incl_vat && (
                     <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                        Exc. VAT Margin: {calculateMarginExVat()}%
                      </span>

                      <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                        Inc. VAT Margin: {calculateMarginIncVat()}%
                      </span>

                      <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                        Retail (Excl. VAT): AED {calculateRetailExVat()}
                      </span>

                      <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-50 rounded-full">
                        VAT (5%): AED {calculateVatAmount()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Cost Price */}
                  <div className="space-y-2">
                    <label htmlFor="cost_price" className="text-sm font-medium text-gray-700">
                      Cost Price (AED)
                    </label>
                    <input
                      type="number"
                      id="cost_price"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.cost_price}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Retail Price */}
                  <div className="space-y-2">
                    <label htmlFor="retail_price_incl_vat" className="text-sm font-medium text-gray-700">
                      Retail Price (AED)
                    </label>
                    <input
                      type="number"
                      id="retail_price_incl_vat"
                      
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.retail_price_incl_vat}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Barcode className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Inventory & Identification</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-5">
                  {/* SKU */}
                  <div className="space-y-2">
                    <label htmlFor="sku" className="text-sm font-medium text-gray-700">
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.sku}
                      placeholder="SKU123"
                      required
                    />
                  </div>

                  {/* Part Number */}
                  <div className="space-y-2">
                    <label htmlFor="part_number" className="text-sm font-medium text-gray-700">
                      Part Number
                    </label>
                    <input
                      type="text"
                      id="part_number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.part_number}
                      placeholder="PN-001"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.quantity}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Product Image</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">Update product photo</p>
              </div>
              
              <div className="p-6">
                <ProductMediaBox
                  onMutate={handleImageChange}
                  image={product.image}
                  newImage={product.productImage}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width */}
          <div className="lg:col-span-3 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;