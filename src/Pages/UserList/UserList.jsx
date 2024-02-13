import { BiPlusMedical } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaMinus } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";


const UserList = () => {
  const db = getDatabase();
  const data = useSelector(state => state.userLoginInfo.userInfo);
  console.log(data);

  const [userList , setuserList] = useState([]);
  const [friendrequestList , setfriendrequestList] = useState([]);
  const [friendList , setfriendList] = useState([]);
  const [userSearch , setuserSearch] = useState([]);
  useEffect(() =>{
    const userRef = ref(db, 'users/');
onValue(userRef, (snapshot) => {
  const arr = []
  snapshot.forEach((item) =>{
    if(data.uid != item.key){
      arr.push({...item.val() , userid : item.key});
    }
  })
  setuserList(arr);
});
  },[])

  const handlefriendrequest = (item) =>{
    console.log(item);
    set(push(ref(db, 'friendrequest/')), {
      sendername : data.displayName,
      senderid  : data.uid,
      receiverName : item.username,
      receiverid : item.userid,
      senderimg : data.photoURL,
      receiverimg : item.img

    });
  }


  useEffect (()=>{
    const friendrequest = ref(db, 'friendrequest/');

    onValue(friendrequest, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) =>{
       arr.push(item.val().receiverid + item.val().senderid);
      })
      setfriendrequestList(arr);
      })
  },[])

  useEffect (()=>{
    const friendrequest = ref(db, 'friend/');

    onValue(friendrequest, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) =>{
        arr.push(item.val().receiverid + item.val().senderid);
      })
      setfriendList(arr);
      })
  },[])

  const handleChange = (e) =>{
    let arr = []
    if(e.target.length == 0){
      setuserSearch([])
    } else{

      userList.filter((item) =>{
        if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
          arr.push(item)
          setuserSearch(arr)
        }
      })
    }
  }

  console.log(userSearch);

  return (
    <div>
      <div className="shadow-md rounded-xl pb-[13px] px-[15px] mt-[43px] overflow-hidden overflow-y-scroll h-[420px]">
         <div>
         <input onChange={handleChange} className="bg-[#c8c7c7d3] outline-none rounded-md my-[5px] pl-[6px] py-[8px] text-[15px] font-Poppins font-medium text-black placeholder:font-Poppins placeholder:font-medium placeholder:text-[15px] placeholder:text-[#5f35f5a6]" type="text" placeholder="Search user"/>
         </div>
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-semibold text-black font-Poppins">
            User List{" "}
          </h1>
          <HiDotsVertical className="text-[20px] text-[#5F35F5]" />
        </div>
       
        {

          userSearch.length > 0
          ?
          userSearch.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]">
            <img
              className="w-[52.182px] h-[54.092px] rounded-full"
              src={item.img}
              alt=""
            />
            <div className="ml-[10px]">
              <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                {item.username}
              </h4>
              <p className="text-[10px] font-Poppins font-medium text-[#4D4D4DBF]">
                {item.email}
              </p>
            </div>
            {
              friendList.includes(item.userid + data.uid) || friendList.includes(data.uid + item.userid)

              ? 
              <FaUserFriends className="py-[5px] rounded bg-[#5F35F5] text-[30px] ml-[20px] text-white" />
             :
             friendrequestList.includes(item.userid + data.uid) || friendrequestList.includes(data.uid + item.userid) 
              ? 
              <FaMinus className="py-[5px] bg-[#5F35F5] text-[25px] ml-[20px] text-white" />
              :
            <BiPlusMedical onClick={()=>handlefriendrequest(item)} className="py-[5px] bg-[#5F35F5] text-[25px] ml-[20px] text-white" />
            }

          </div>
          ))
          :
          userList.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex items-center mt-[25px] border-b-2 border-b-[#b1afaf] pb-[10px]">
            <img
              className="w-[52.182px] h-[54.092px] rounded-full"
              src={item.img}
              alt=""
            />
            <div className="ml-[10px]">
              <h4 className="text-[14px] font-Poppins font-semibold leading-[1]">
                {item.username}
              </h4>
              <p className="text-[10px] font-Poppins font-medium text-[#4D4D4DBF]">
                {item.email}
              </p>
            </div>
            {
              friendList.includes(item.userid + data.uid) || friendList.includes(data.uid + item.userid)

              ? 
              <FaUserFriends className="py-[5px] rounded bg-[#5F35F5] text-[30px] ml-[20px] text-white" />
             :
             friendrequestList.includes(item.userid + data.uid) || friendrequestList.includes(data.uid + item.userid) 
              ? 
              <FaMinus className="py-[5px] bg-[#5F35F5] text-[25px] ml-[20px] text-white" />
              :
            <BiPlusMedical onClick={()=>handlefriendrequest(item)} className="py-[5px] bg-[#5F35F5] text-[25px] ml-[20px] text-white" />
            }

          </div>
          ))
        }
      </div>
    </div>
  );
};

export default UserList;
