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
  const [isAvailable, setIsAvailable] = useState(false); // Default: not available

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
        // Update existing item
        await updateDoc(doc(db, "menu", editing), {
          name,
          price: Number(price),
          image,
          isAvailable,
        });
        setEditing(null);
      } else {
        // Add new item
        await addDoc(collection(db, "menu"), {
          name,
          price: Number(price),
          image,
          isAvailable: false, // Default to not available
        });
      }

      // Reset form
      setName("");
      setPrice("");
      setImage(null);
      setIsAvailable(false);

      // Refresh menu items
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
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* White glowing dot in top-right corner */}
      <div className="fixed top-6 right-6 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,0.7)]"></div>

      <div className="container mx-auto py-20 px-6">
        <h2 className="text-2xl font-bold mb-6">Menu Management</h2>

        {/* Form section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">
            {editing ? "Edit Menu Item" : "Add New Menu Item"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Name
              </label>
              <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border bg-gray-800 border-gray-700 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border bg-gray-800 border-gray-700 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="w-full border bg-gray-800 border-gray-700 rounded p-2 text-white file:bg-gray-700 file:text-white file:border-0 file:p-1 file:rounded"
              />
            </div>

            {image && (
              <div className="mt-2">
                <p className="text-sm text-gray-300 mb-1">Preview:</p>
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(!isAvailable)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Available for Order</span>
              </label>
            </div>

            {uploading && <p className="text-blue-400">Uploading image...</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 font-bold"
                disabled={uploading}
              >
                {editing ? "Update Item" : "Add Item"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Menu items list */}
        <h3 className="text-xl font-semibold mb-4">Current Menu Items</h3>

        {loading ? (
          <p>Loading menu items...</p>
        ) : menuItems.length === 0 ? (
          <p>No menu items available. Add your first item above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-900"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <button
                      onClick={() =>
                        toggleAvailability(item.id, item.isAvailable)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                        item.isAvailable
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Not Available"}
                    </button>
                  </div>
                  <p className="text-gray-300">${item.price}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold"
                    >
                      Delete
                    </button>
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
