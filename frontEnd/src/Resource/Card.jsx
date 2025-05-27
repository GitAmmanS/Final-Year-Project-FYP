import { useNavigate } from "react-router-dom";
import { MdOutlineVideoLabel, MdMeetingRoom, MdStore } from "react-icons/md";

const Card = () => {
  const navigate = useNavigate();

  const handleNavigation = (resource) => {
    navigate("/resource", { state: { name: resource } });
  };

  return (
    <div>
      <div className="text-3xl font-bold  my-8 ml-2 text-gray-800">
        Resources
      </div>
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2  gap-8 m-5 mt-16 ml-16 ">
        {/* Lab Card */}
        <div
          className="w-[70%] mb-6 bg-blue-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-blue-700 cursor-pointer"
          onClick={() => handleNavigation("lab")}
        >
          <span>Labs</span>
          <MdOutlineVideoLabel size={32} />
        </div>

        {/* Room Card */}
        <div
          className="w-[70%] mb-6 bg-green-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-green-700 cursor-pointer"
          onClick={() => handleNavigation("class_room")}
        >
          <span>Rooms</span>
          <MdMeetingRoom size={32} />
        </div>

        {/* LT  Card */}
        <div
          className="w-[70%] mb-6 bg-orange-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-orange-700 cursor-pointer"
          onClick={() => handleNavigation("Lecture_Theater")}
        >
          <span>Lecture Theater</span>
          <MdMeetingRoom size={32} />
        </div>

        {/* Staff Room Card */}
        <div
          className="w-[70%] mb-6 bg-gray-900 text-white h-[7rem] rounded-lg flex items-center justify-between p-4 text-2xl shadow-lg transition duration-300 hover:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("staff_room")}
        >
          <span>Staff Rooms</span>
          <MdStore size={32} />
        </div>
      </div>
    </div>
  );
};

export default Card;
