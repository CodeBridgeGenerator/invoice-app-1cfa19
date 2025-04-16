import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import client from "../../../services/restClient";
import ProfilesEditDialogComponent from "../ProfilesPage/ProfilesEditDialogComponent";

function ProfileCard(props) {
  const [profiles, setProfiles] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [iprofile, setIProfile] = useState(0);
  const [data, setData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { user } = props;

  useEffect(() => {
    if (iprofile && data[iprofile]?.position?.roleId)
      client
        .service("roles")
        .find({ query: { roleId: data[iprofile].position.roleId } })
        .then((res) => setRole(res.data[0].name));
  }, [iprofile]);

  // Fetch profiles data from the service
  useEffect(() => {
    client
      .service("profiles")
      .find({
        query: {
          $limit: 10000,
          $populate: [
            { path: "userId", service: "users", select: ["name"] },
            { path: "company", service: "companies", select: ["name"] },
            {
              path: "position",
              service: "positions",
              select: ["name", "roleId"],
            },
            { path: "branch", service: "branches", select: ["name"] },
            { path: "section", service: "sections", select: ["name"] },
            { path: "department", service: "departments", select: ["name"] },
            {
              path: "address",
              service: "user_addresses",
              select: ["Street1", "City", "State", "Country"],
            },
            {
              path: "phone",
              service: "user_phones",
              select: ["countryCode", "operatorCode", "number"],
            },
            { path: "position.roleId", service: "roles", select: ["name"] },
          ],
        },
      })
      .then((res) => {
        setProfiles(res.data);
      })
      .catch((error) => {
        props.alert({
          title: "User Profiles",
          type: "error",
          message: error.message || "Failed to get profiles",
        });
      });
  }, []);

  // Fetch the role name based on roleId
  const fetchRoleName = async (roleId) => {
    if (!roleNames[roleId]) {
      try {
        const role = await client.service("roles").get(roleId);
        setRoleNames((prevNames) => ({ ...prevNames, [roleId]: role.name }));
      } catch (error) {
        console.error("Error fetching role name:", error);
      }
    }
  };

  useEffect(() => {
    profiles.forEach((profile) => {
      if (profile.position?.roleId) {
        fetchRoleName(profile.position.roleId);
      }
    });
  }, [profiles]);

  function ProfileSection({ items, className }) {
    return (
      <div className={`flex ${className} max-md:max-w-full`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col flex-1 shrink basis-0 min-w-[180px] max-md:max-w-full"
          >
            <div
              className="leading-none text-gray-600  mb-2 max-md:max-w-full"
              style={{ fontSize: "13px" }}
            >
              {item.title}
            </div>
            <div className="leading-5  max-md:max-w-full">{item.content}</div>
          </div>
        ))}
      </div>
    );
  }
  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setEditProfile(true);
  };

  return (
    <section className="profile-cards-container">
      {profiles.map((profile, index) => {
        const roleName = roleNames[profile.position?.roleId] || "Role";

        const bioAndSkills = [
          { title: "Bio", content: profile.bio || "N/A" },
          { title: "Skills", content: profile.skills?.join(", ") || "N/A" },
        ];

        const personalInfo = [
          {
            title: "Contact no.",
            content: `${profile.phone?.countryCode || ""} ${profile.phone?.operatorCode || ""} ${profile.phone?.number || ""}`,
          },
          { title: "Role", content: profile.position?.name || "N/A" },
          { title: "Manager", content: profile.manager?.name || "N/A" },
          { title: "Department", content: profile.department?.name || "N/A" },
        ];

        const companyInfo = [
          { title: "Section", content: profile.section?.name || "N/A" },
          { title: "Company", content: profile.company?.name || "N/A" },
          { title: "Branch", content: profile.branch?.name || "N/A" },
          { title: "Level", content: profile.role?.name || "N/A" },
        ];

        const address = [
          {
            title: "Address",
            content: `${profile.address?.Street1 || ""}, ${profile.address?.City || ""}, ${profile.address?.State || ""}, ${profile.address?.Country || ""}`,
          },
        ];

        return (
          <div
            key={index}
            className="surface-card mb-5 p-4 rounded-lg"
            style={{
              marginBottom: "20px", // Additional space between cards
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // Shadow effect
            }}
          >
            <div className="flex flex-wrap justify-content-between align-items-center">
              <div className="flex align-items-center">
                <Avatar
                  className="mr-4"
                  label={profile.name.charAt(0) || "N"}
                  style={{
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#D30000",
                    fontSize: "40px",
                    color: "#ffffff",
                  }}
                  shape="circle"
                />
                <div className="ml-3">
                  <h5 className="font-bold mb-2">
                    {profile.name || "Unknown"}
                  </h5>
                  <span className=" text-#2A4454-500">
                    {profile.position?.name || "Unknown Position"}
                  </span>
                  <div>
                    <Tag className="mt-2" value={roleName} severity="success" />
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                {/* <span className="self-stretch px-3.5 py-1.5 my-auto text-sm tracking-wide leading-none whitespace-nowrap bg-gray-200 rounded-md text-slate-700">
                  Default
                </span> */}
                <Button
                  label="Edit profile"
                  onClick={() => handleEditProfile(profile)}
                  className="p-button-rounded p-button-secondary"
                  style={{
                    backgroundColor: "white",
                    color: "#D30000",
                    border: "2px solid #D30000",
                    height: "30px",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mt-5 w-full  tracking-wide max-md:max-w-full">
              <ProfileSection
                items={bioAndSkills}
                className="flex-wrap gap-5 items-start w-full"
              />

              <ProfileSection
                items={personalInfo}
                className="flex-wrap mt-5 gap-5 items-start w-full"
              />
              <ProfileSection
                items={companyInfo}
                className="flex-wrap mt-5 gap-5 items-start w-full"
              />
              <ProfileSection
                items={address}
                className="flex-wrap mt-5  gap-5 items-start w-full"
              />
            </div>
            <ProfilesEditDialogComponent
              show={editProfile}
              entity={selectedProfile} // Pass selected profile for editing
              onHide={() => setEditProfile(false)}
              userId={props.user._id}
            />
          </div>
        );
      })}
    </section>
  );
}
const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});
export default connect(mapState, mapDispatch)(ProfileCard);
