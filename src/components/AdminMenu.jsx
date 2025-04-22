import { useState, useEffect } from "react";
import { db } from "../config"; // Firebase config file
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiImage,
  FiMenu,
  FiStar,
  FiTrendingUp,
  FiCoffee,
} from "react-icons/fi";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfcvgpw8n/image/upload";
const UPLOAD_PRESET = "MunchMate";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      setImage(res.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image) {
      alert("Please fill all fields and upload an image");
      return;
    }

    try {
      if (editing) {
        await updateDoc(doc(db, "menu", editing), {
          name,
          price: Number(price),
          image,
          isAvailable,
        });
        setEditing(null);
      } else {
        await addDoc(collection(db, "menu"), {
          name,
          price: Number(price),
          image,
          isAvailable: false,
        });
      }

      setName("");
      setPrice("");
      setImage(null);
      setIsAvailable(false);
      setFormVisible(false);
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("Failed to save menu item. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setName(item.name);
    setPrice(item.price);
    setImage(item.image);
    setIsAvailable(item.isAvailable !== undefined ? item.isAvailable : false);
    setFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, "menu", id));
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "menu", id), {
        isAvailable: !currentStatus,
      });
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setName("");
    setPrice("");
    setImage(null);
    setIsAvailable(false);
    setFormVisible(false);
  };

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 bg-black opacity-20 z-0"></div>

      {/* Abstract geometric shapes */}
      <div className="fixed top-40 left-10 w-64 h-64 rounded-full border border-[#302b63]/20 animate-pulse z-0"></div>
      <div
        className="fixed bottom-20 right-10 w-80 h-80 rounded-full border border-[#302b63]/10 animate-pulse z-0"
        style={{ animationDuration: "10s" }}
      ></div>
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#302b63]/5 animate-pulse z-0"
        style={{ animationDuration: "15s" }}
      ></div>

      {/* Subtle star-like dots */}
      <div className="fixed top-20 left-40 w-1 h-1 rounded-full bg-white opacity-50 z-0"></div>
      <div className="fixed top-32 right-96 w-1 h-1 rounded-full bg-white opacity-50 z-0"></div>
      <div className="fixed bottom-40 left-80 w-1 h-1 rounded-full bg-white opacity-50 z-0"></div>
      <div className="fixed top-80 right-20 w-2 h-2 rounded-full bg-white opacity-30 z-0"></div>
      <div className="fixed bottom-20 left-20 w-2 h-2 rounded-full bg-white opacity-30 z-0"></div>

      <div className="container mx-auto py-20 px-4 relative z-10">
        {/* Header Section - Enhanced with icon */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="bg-[#302b63] rounded-xl p-3 shadow-lg shadow-[#302b63]/30 mr-4">
              <FiMenu size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#302b63] to-[#24243e] bg-clip-text text-transparent">
                Menu Management
              </h2>
              <p className="text-gray-400 mt-2 flex items-center">
                <FiCoffee className="mr-2" /> Add, update and manage your
                restaurant's menu items
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              cancelEdit();
              setFormVisible(!formVisible);
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              formVisible
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gradient-to-r from-[#0f0c29] to-[#302b63] hover:from-[#24243e] hover:to-[#302b63] text-white shadow-lg shadow-[#302b63]/30 ring-1 ring-[#302b63]/50"
            }`}
          >
            <FiPlus size={18} />
            <span>{formVisible ? "Cancel" : "Add New Item"}</span>
          </button>
        </div>

        {/* Form section - Collapsible with enhanced styling */}
        {formVisible && (
          <div className="bg-black p-8 rounded-xl shadow-xl mb-12 border border-[#302b63]/50 relative overflow-hidden backdrop-blur-sm">
            {/* Enhanced decoration elements */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#302b63]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#24243e]/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#302b63]/10 rounded-full blur-2xl"></div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-[#302b63] to-[#24243e] bg-clip-text text-transparent mb-8 flex items-center">
              {editing ? (
                <FiEdit size={24} className="mr-2 text-[#302b63]" />
              ) : (
                <FiPlus size={24} className="mr-2 text-[#302b63]" />
              )}
              {editing ? "Edit Menu Item" : "Add New Menu Item"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 relative"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border bg-black/30 border-[#302b63]/50 rounded-lg p-3 text-white focus:border-[#302b63] focus:ring-2 focus:ring-[#302b63]/50 outline-none transition backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price in Rupees"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border bg-black/30 border-[#302b63]/50 rounded-lg p-3 text-white focus:border-[#302b63] focus:ring-2 focus:ring-[#302b63]/50 outline-none transition backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="flex items-center bg-black/20 p-4 rounded-lg border border-[#302b63]/30">
                  <label className="flex items-center cursor-pointer space-x-3 w-full">
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                        isAvailable ? "bg-[#302b63]" : "bg-[#24243e]"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                          isAvailable ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      Available for Order
                    </span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={() => setIsAvailable(!isAvailable)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image
                  </label>
                  <div className="border-2 border-dashed border-[#302b63]/50 rounded-lg p-4 text-center bg-black/20 transition-all hover:border-[#302b63] hover:bg-black/30">
                    {image ? (
                      <div className="relative">
                        <img
                          src={image}
                          alt="Preview"
                          className="mx-auto h-48 object-cover rounded shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiXCircle />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48">
                        <FiImage size={40} className="text-[#302b63]/70 mb-2" />
                        <p className="text-sm text-gray-400">
                          Click to upload an image
                        </p>
                        {uploading && (
                          <div className="mt-2 flex items-center">
                            <div className="w-4 h-4 border-2 border-t-[#302b63] border-[#302b63]/30 rounded-full animate-spin mr-2"></div>
                            <p className="text-[#302b63]">Uploading...</p>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                        image ? "hidden" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-3 self-end mt-auto">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0f0c29] to-[#302b63] hover:from-[#24243e] hover:to-[#302b63] text-white px-6 py-3 rounded-lg disabled:opacity-50 font-bold flex items-center space-x-2 shadow-lg shadow-[#302b63]/30 transition border border-[#302b63]/30"
                    disabled={uploading}
                  >
                    {editing ? (
                      <>
                        <FiEdit size={18} />
                        <span>Update Item</span>
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} />
                        <span>Add Item</span>
                      </>
                    )}
                  </button>

                  {editing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-800/70 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold flex items-center space-x-2 border border-gray-700"
                    >
                      <FiXCircle size={18} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Menu items list - Enhanced with glowing effect */}
        <div className="mb-8">
          <div className="flex items-center">
            <FiTrendingUp size={24} className="text-[#302b63] mr-3" />
            <h3 className="text-2xl font-bold">Current Menu</h3>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-full mb-8 mt-2"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 border border-[#302b63]/30 rounded-xl bg-black backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-t-[#302b63] border-[#302b63]/20 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center p-12 border border-[#302b63]/30 rounded-xl bg-black backdrop-blur-sm">
            <div className="inline-flex h-20 w-20 rounded-full bg-[#302b63]/20 items-center justify-center mb-6">
              <FiPlus size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              No menu items yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first menu item
            </p>
            <button
              onClick={() => setFormVisible(true)}
              className="bg-gradient-to-r from-[#0f0c29] to-[#302b63] hover:from-[#24243e] hover:to-[#302b63] text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-[#302b63]/30 border border-[#302b63]/30"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-black border border-[#302b63]/30 rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-[#302b63]/40 hover:-translate-y-1 duration-300"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-[#302b63]/0 group-hover:bg-[#302b63]/5 transition-colors duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0f0c29] to-[#302b63] rounded-xl opacity-0 group-hover:opacity-30 blur group-hover:blur-sm transition duration-300"></div>

                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent opacity-70"></div>

                  {item.isAvailable && (
                    <div className="absolute top-2 right-2 bg-[#302b63]/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <FiStar size={12} className="mr-1" />
                      Available
                    </div>
                  )}
                </div>

                <div className="p-5 relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="text-xl font-bold text-white">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() =>
                        toggleAvailability(item.id, item.isAvailable)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                        item.isAvailable
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <FiCheckCircle size={16} />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <FiXCircle size={16} />
                          <span>Unavailable</span>
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-[#302b63]/20 hover:bg-[#302b63]/30 text-[#302b63] p-2 rounded-lg transition-colors border border-[#302b63]/30"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-colors border border-red-600/30"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
