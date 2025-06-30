const editProfile = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-center flex-col gap-3">
        <span className="pl-3 font-extrabold font-mono text-3xl">
          Edit Profile
        </span>
        <div className="flex items-center justify-center flex-col gap-3 mt-7">
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm pl-3">Username</span>
            <input
              type="text"
              placeholder="Username"
              className="p-1 pl-5 bg-white rounded-md text-gray-800"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="p-1 pl-5 bg-white rounded-md text-gray-800"
          />
        </div>
      </div>
    </div>
  );
};

export default editProfile;
