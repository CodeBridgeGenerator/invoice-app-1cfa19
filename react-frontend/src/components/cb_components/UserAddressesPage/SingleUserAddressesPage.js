import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import ProfilesPage from "../ProfilesPage/ProfilesPage";

const SingleUserAddressesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [userId, setUserId] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("userAddresses")
      .get(urlParams.singleUserAddressesId, {
        query: {
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
            "userId",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const userId = Array.isArray(res.userId)
          ? res.userId.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.userId
            ? [{ _id: res.userId._id, name: res.userId.name }]
            : [];
        setUserId(userId);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "UserAddresses",
          type: "error",
          message: error.message || "Failed get userAddresses",
        });
      });
  }, [props, urlParams.singleUserAddressesId]);

  const goBack = () => {
    navigate("/userAddresses");
  };

  const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

  const menuItems = [
    {
      label: "Copy link",
      icon: "pi pi-copy",
      command: () => copyPageLink(),
    },
    {
      label: "Help",
      icon: "pi pi-question-circle",
      command: () => toggleHelpSidebar(),
    },
  ];

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-12">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
              <Button
                className="p-button-text"
                icon="pi pi-chevron-left"
                onClick={() => goBack()}
              />
              <h3 className="m-0">User Addresses</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>userAddresses/{urlParams.singleUserAddressesId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Street1</label>
                <p className="m-0 ml-3">{_entity?.Street1}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Street2</label>
                <p className="m-0 ml-3">{_entity?.Street2}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Poscode</label>
                <p className="m-0 ml-3">{_entity?.Poscode}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">City</label>
                <p className="m-0 ml-3">{_entity?.City}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">State</label>
                <p className="m-0 ml-3">{_entity?.State}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Province</label>
                <p className="m-0 ml-3">{_entity?.Province}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Country</label>
                <p className="m-0 ml-3">{_entity?.Country}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">User</label>
                {userId.map((elem) => (
                  <Link key={elem._id} to={`/users/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <TabView>
            <div className="mt-2">
              <TabView>
                <TabPanel header="true" leftIcon="pi pi-building-columns mr-2">
                  <ProfilesPage />
                </TabPanel>
              </TabView>
            </div>
          </TabView>
        </div>

        <CommentsSection
          recordId={urlParams.singleUserAddressesId}
          user={props.user}
          alert={props.alert}
          serviceName="userAddresses"
        />
        <div
          id="rightsidebar"
          className={classNames(
            "overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out",
            { hidden: !isHelpSidebarVisible },
          )}
          style={{ top: "60px", height: "calc(100% - 60px)" }}
        >
          <div className="flex flex-column h-full p-4">
            <span className="text-xl font-medium text-900 mb-3">Help bar</span>
            <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleUserAddressesPage);
