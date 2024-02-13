import { useEffect, useState } from "react";
import Raghav from "../../assets/Raghav.svg";
// import Swathi from "../../assets/Swathi.svg";
// import Kiran from "../../assets/Kiran.svg";
// import TejeshwiniC from "../../assets/TejeshwiniC.svg";
import { HiDotsVertical } from "react-icons/hi";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const MyGroup = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [mygroupList, setmygroupList] = useState([]);
  useEffect(() => {
    const Groupraf = ref(db, "Group/");
    onValue(Groupraf, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid) {
          arr.push(item.val());
        }
      });
      setmygroupList(arr);
    });
  }, []);

  return (
    <div>
      <div className="shadow-md rounded-xl pb-[98px] px-[15px] mt-[43px] overflow-hidden overflow-y-scroll h-[420px]">
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-semibold text-black font-Poppins">
            My Groups{" "}
          </h1>
          <HiDotsVertical className="text-[20px] text-[#5F35F5]" />
        </div>
        {mygroupList.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <div className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]">
            <img
              className="w-[52.182px] h-[54.092px] rounded-full"
              src={Raghav}
              alt=""
            />
            <div className="ml-[14px]">
              <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                {item.groupName}
              </h4>
              <p className="text-[12px] font-Poppins font-medium text-[#4D4D4DBF]">
                {item.grouptagName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGroup;
