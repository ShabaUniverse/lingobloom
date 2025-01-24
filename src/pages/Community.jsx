import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { Link } from "react-router-dom";
import Pending from "../components/Pending";

const Community = ({activeUID}) => {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setPending(true)
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPending(false)
        setUsers(usersList.filter((user) => user.id !== localStorage.activeUID))
      }
      catch(error){
        console.log(eror.message)
        setPending(false)
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(searchInput.toLowerCase()),
    );
    setFilteredUsers(results);
  }, [searchInput, users]);

  return (
    <div className="community">
      <div className="community-container w-[1200px] mx-auto">
        <div className="community-wrapper pt-10">
          <input
            type="text"
            id="search"
            className=" bg-customGreen px-3 py-1 w-[300px] outline-none rounded-lg text-white placeholder:text-white"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {/* search results */}

          {searchInput && <p className="my-10">Search results:</p>}
          <div className="search-results mt-5 flex ">
            {searchInput &&
              filteredUsers.map((user) => (
                <Link
                  to={`/community/profile/${user.id}`}
                  key={user.id}
                  className="user-profile flex flex-col items-center justify-start mx-5">
                  <div
                    className=" w-[150px] h-[150px] rounded-full"
                    style={{
                      backgroundImage: `url(${user.profilePicURL})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}></div>
                  <p className=" ml-2">{user.name}</p>
                  {/* Add more user details as needed */}
                </Link>
              ))}
          </div>

          {/* Reccomendations */}
          <div className="recs p- rounded-lg mt-10">
            <span className=" text-lg font-bold text-black">
              Reccomendations:{" "}
            </span>
            {pending && <Pending />}
            <div className="all-blocks flex items-center mt-4">
              {users.map((user) => (
                <Link
                  to={`/community/profile/${user.id}`}
                  className="flex flex-col justify-center items-center  text-black px-6 py-5 mr-4 rounded-lg"
                  key={user.uid}>
                  {!user?.profilePicURL ? (
                    <div className=" bg-customGrey text-black h-[150px] w-[150px] rounded-full flex justify-center items-center font-semibold">
                      no photo, still
                    </div>
                  ) : (
                    <div
                      className=" w-[150px] h-[150px] rounded-full"
                      style={{
                        backgroundImage: `url(${user.profilePicURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}></div>
                  )}
                  <p className=" mt-2">{user.name ? user.name : "Unknown"}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
