import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import client from "../../../services/restClient";
import AccountChangePassword from "./AccountChangePassword";
import AccountChangeName from "./AccountChangeName";
import AccountChangeImage from "./AccountChangeImage";
import ProfilesCreateDialogComponent from "../ProfilesPage/ProfilesCreateDialogComponent";
import ProfileCard from "./Profilecard";
const Account = (props) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [addProfile, setAddProfile] = useState(false);
  const [iprofile, setIProfile] = useState(0);
  const [role, setRole] = useState("");
  const [lastLogin, setLastLogin] = useState("");
  const [data, setData] = useState([]);
  const { user } = props;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch last login date for the user
    client
      .service("loginHistory")
      .find({
        query: { userId: user._id, $limit: 1, $sort: { loginTime: -1 } },
      }) // Get the most recent login
      .then((res) => {
        if (res.data.length > 0) {
          setLastLogin(new Date(res.data[0].loginTime).toLocaleString()); // Format the date as needed
        } else {
          setLastLogin("No login records available");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch last login", error);
        setLastLogin("Failed to fetch last login");
      });
  }, [user._id]);

  useEffect(() => {
    if (iprofile && data[iprofile]?.position?.roleId)
      client
        .service("roles")
        .find({ query: { roleId: data[iprofile].position.roleId } })
        .then((res) => setRole(res.data[0].name));
  }, [iprofile]);

  useEffect(() => {
    client
      .service("profiles")
      .find({
        query: {
          $limit: 10000,
          $populate: [
            {
              path: "userId",
              service: "users",
              select: ["name"],
            },
            {
              path: "company",
              service: "companies",
              select: ["name"],
            },
            {
              path: "position",
              service: "positions",
              select: ["name", "roleId"],
            },
            {
              path: "branch",
              service: "branches",
              select: ["name"],
            },
            {
              path: "section",
              service: "sections",
              select: ["name"],
            },
            {
              path: "department",
              service: "departments",
              select: ["name"],
            },
            {
              path: "address",
              service: "user_addresses",
              select: [
                "userId",
                "Street1",
                "Street2",
                "Poscode",
                "City",
                "State",
                "Province",
                "Country",
              ],
            },
            {
              path: "phone",
              service: "user_phones",
              select: [
                "userId",
                "countryCode",
                "operatorCode",
                "number",
                "type",
              ],
            },
          ],
        },
      })
      .then((res) => {
        let results = res.data;
        setData(results);
      })
      .catch((error) => {
        props.alert({
          title: "User Profiles",
          type: "error",
          message: error.message || "Failed get profiles",
        });
      });
  }, []);

  const items = [
    { label: "Profile" },
    { label: "Emergency" },
    { label: "Benefits" },
    { label: "Leaves" },
    { label: "Claims" },
    { label: "Onboarding" },
    { label: "Login history" },
  ];

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleAddProfile = () => {
    setAddProfile(true);
  };

  function ProfileField({ label, value }) {
    return (
      <div className="flex flex-col mt-5 w-full">
        <label className="text-gray-600">{label}</label>
        <p className="font-semibold">{value}</p>
      </div>
    );
  }

  function BackButton() {
    return (
      <Button
        onClick={() => navigate("/project")}
        icon="pi pi-angle-left"
        label="Back to dashboard"
        className="gap-1.5 font-semibold tracking-wide text-right text-[#D30000] bg-transparent border-0 ml-[-1.2rem]"
        style={{
          color: "#D30000",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "13px",
        }}
      />
    );
  }

  const profileData = [
    { label: "Email", value: user.email },
    { label: "User ID", value: user._id },
    { label: "Employment type", value: "Full-time employment" },
    { label: "Hire date", value: "2 Aug 2023" },
    { label: "Last login", value: lastLogin },
  ];

  const profile = (data, i, len) => (
    <>
      <div className="px-6 py-5" style={{ backgroundColor: "white" }}>
        <div>
          <ProfileCard />
        </div>{" "}
      </div>
    </>
  );

  const sidebarContent = (
    <nav
      className="flex flex-col items-start px-5 pt-20 pb-4 leading-none bg-gray-50 border-r border-zinc-200"
      style={{ width: "280px", fontSize: "13px" }}
    >
      <BackButton />
      <hr className="shrink-0 self-stretch mt-3 w-full h-px border border-solid border-zinc-200" />
      <h1 className="mt-3 text-2xl font-bold leading-none text-slate-700">
        Profile
      </h1>
      <section className="flex flex-col self-stretch tracking-wide">
        <Button
          label="Change password"
          onClick={handleChangePassword}
          className="font-semibold text-left text-[#D30000] bg-transparent border-0"
          style={{
            color: "#D30000",
            backgroundColor: "transparent",
            border: "none",
            paddingLeft: 0,
            fontSize: "13px",
          }}
        />
        {profileData.map((field, index) => (
          <ProfileField
            key={index}
            label={field.label}
            value={field.value}
            className="mb-1"
          />
        ))}
      </section>
      <footer className="mt-32 text-xs tracking-wide leading-5 text-zinc-500">
        © 2024 CodeBridge Sdn Bhd. All rights reserved.
      </footer>
    </nav>
  );
  const onTabChange = (e) => {
    setActiveTabIndex(e.index);
  };

  const loginHistory = () => <div>Todo</div>;
  const sessions = () => <div>Todo</div>;
  const preferences = () => <div>Todo</div>;
  const settings = () => <div>Todo</div>;

  return (
    <div className="flex bg-white">
      {/* Side Menu */}
      <div
        className=" h-screen mt-4 fixed "
        style={{ width: "300px", height: "100vh" }}
      >
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div
        className="col-12 flex justify-content-center mt-7 ml-[250px] "
        style={{ width: "1300px", overflowX: "hidden" }}
      >
        <div className="col-12">
          <div className="flex flex-column align-items-start mb-3">
            <div className="flex flex-column align-items-start mb-3">
              <div
                className="surface-ground"
                style={{ backgroundColor: "white" }}
              >
                <div className="surface-section px-6 pt-5">
                  <TabMenu
                    model={items}
                    activeIndex={activeIndex}
                    onTabChange={onTabChange}
                    disabled={true}
                  />
                </div>
                {activeTabIndex === 0
                  ? profile(data[iprofile], iprofile, data.length)
                  : null}
              </div>
              {activeTabIndex === 0 ? (
                <div className="flex justify-content-center w-full">
                  <Button
                    label="Add a new profile"
                    onClick={handleAddProfile}
                    className="p-button-rounded p-button-primary"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AccountChangePassword
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      />
      <AccountChangeName
        show={showChangeName}
        onHide={() => setShowChangeName(false)}
      />
      <AccountChangeImage
        show={showChangeImage}
        onHide={() => setShowChangeImage(false)}
      />

      <ProfilesCreateDialogComponent
        show={addProfile}
        onHide={() => setAddProfile(false)}
        userId={props.user._id}
      />
    </div>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(Account);
