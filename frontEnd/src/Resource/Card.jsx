import { useNavigate } from "react-router-dom";
import { MdOutlineVideoLabel, MdMeetingRoom, MdStore } from "react-icons/md";

const Card = () => {
  const navigate = useNavigate();

  const handleNavigation = (resource) => {
    navigate("/resource", { state: { name: resource } });
  };

  return (
    <div>
      <div className="text-2xl font-bold text-center mt-5 text-gray-800">
        Resources
      </div>
      <div className="flex flex-wrap justify-center gap-8 m-5">
        {/* Lab Card */}
        <div
          className="w-[40%] bg-blue-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-blue-700 cursor-pointer"
          onClick={() => handleNavigation("lab")}
        >
          <span>Lab</span>
          <MdOutlineVideoLabel size={32} />
        </div>

        {/* Room Card */}
        <div
          className="w-[40%] bg-green-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-green-700 cursor-pointer"
          onClick={() => handleNavigation("room")}
        >
          <span>Room</span>
          <MdMeetingRoom size={32} />
        </div>

        {/* Store Card */}
        <div
          className="w-[40%] bg-gray-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-gray-700 cursor-pointer"
          onClick={() => navigate('/store')}
        >
          <span>Store</span>
          <MdStore size={32} />
        </div>
      </div>
    </div>
  );
};

export default Card;
