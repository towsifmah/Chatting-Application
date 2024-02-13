import FriendsReunion from "../../assets/FriendsReunion.svg";
// import FriendsForever from "../../assets/FriendsForever.svg";
// import CrazyCousins from "../../assets/CrazyCousins.svg";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [show, setshow] = useState("");

  const [groupName, setgroupName] = useState("");
  const [grouptagName, setgrouptagName] = useState("");

  const [groupnameErr, setgroupnameErr] = useState("");
  const [grouptagnameErr, setgrouptagnameErr] = useState("");
  const [groupList, setgroupList] = useState([]);
  const handleChange = (e) => {
    setgroupName(e.target.value);
    setgroupnameErr("");
  };
  const handletagName = (e) => {
    setgrouptagName(e.target.value);
    setgrouptagnameErr("");
  };
  const handleClick = () => {
    setshow(!show);
  };

  const handleCreate = () => {
    if (!groupName) {
      setgroupnameErr("Please give your Group Name");
    }
    setTimeout(() => {
      setshow("");
    }, 2000);

    if (!grouptagName) {
      setgrouptagnameErr("Please give your Group Tagname");
    }
    setgroupName("");
    setgrouptagName("");

    set(push(ref(db, "Group/")), {
      groupName: groupName,
      grouptagName: grouptagName,
      adminName: data.displayName,
      adminid: data.uid,
    });
  };

  useEffect(() => {
    const Groupraf = ref(db, "Group/");
    onValue(Groupraf, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.val().adminid) {
          arr.push(item.val());
        }
      });
      setgroupList(arr);
    });
  }, []);
  return (
    <div>
      <div className="shadow-md rounded-xl scroll-smooth overflow-y-scroll overflow-hidden h-[420px] pt-[13px] pb-[21px] px-[15px] mt-[43px]">
        <div className="flex justify-between items-center fixed">
          <h1 className="text-[20px] font-semibold text-black font-Poppins mr-[130px]">
            Groups List
          </h1>

          {show ? (
            <button
              onClick={handleClick}
              className="bg-[#5F35F5] px-1 py-1 pr-1 pl-1 rounded text-center ml-[60px] font-Poppins text-white text-[15px]"
            >
              Back
            </button>
          ) : (
            <button
              onClick={handleClick}
              className="bg-[#5F35F5] px-1 py-1 pr-1 pl-1 rounded text-center font-Poppins text-white text-[15px]"
            >
              create group
            </button>
          )}
        </div>

        {show && (
          <div className="h-[80vh] w-[600px] z-50 bg-white absolute top-[140px] left-[850px] scroll-smooth overflow-y-scroll rounded-xl drop-shadow-2xl border-[5px] border-[#5F35F5] p-[10px]">
            <div className="flex justify-center flex-col mt-[20px]">
              <input
                onChange={handleChange}
                value={groupName}
                className="w-full p-[10px] font-Poppins text-[20px] outline-none border-b-[2px] border-b-[#5f35f581] text-[#5F35F5] placeholder:font-Poppins placeholder:text-[#5f35f581]"
                type="text"
                placeholder="Group Name"
              />
              {groupnameErr && (
                <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold">
                  {groupnameErr}
                </p>
              )}
              <input
                onChange={handletagName}
                value={grouptagName}
                className="w-full mt-[8px] p-[10px] font-Poppins text-[20px] outline-none border-b-[2px] border-b-[#5f35f581] text-[#5F35F5] placeholder:font-Poppins placeholder:text-[#5f35f581]"
                type="text"
                placeholder="Group Tagname"
              />
              {grouptagnameErr && (
                <p className=" py-1 text-[#ED4337] font-Nunito text-[12px] font-semibold">
                  {grouptagnameErr}
                </p>
              )}
              <button
                onClick={handleCreate}
                className="p-[20px] bg-[#5F35F5] mt-[20px] rounded font-Poppins text-white font-bold text-[20px] hover:bg-transparent hover:border-[2px] hover:border-[#5F35F5] hover:text-[#5F35F5] hover:font-bold duration-300"
              >
                Create Group
              </button>
            </div>
          </div>
        )}
        {groupList.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <div className="flex items-center mt-[50px] justify-between border-b-2 border-b-[#b1afaf] pb-[10px]">
            <img
              className="w-[78px] h-[78px] rounded-full"
              src={FriendsReunion}
              alt=""
            />
            <div className="ml-[14px]">
              <h4 className="text-[16px] font-Poppins font-semibold leading-[1]">
                {item.groupName}
              </h4>
              <p className="text-[14px] font-Poppins font-medium text-[#4D4D4DBF]">
                {item.grouptagName}
              </p>
            </div>
            <p className="text-[10px] font-Poppins font-medium text-[#5F35F5] ">
              {item.adminName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
