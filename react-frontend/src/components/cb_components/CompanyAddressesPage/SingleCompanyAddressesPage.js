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

const SingleCompanyAddressesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [companyId, setCompanyId] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("companyAddresses")
      .get(urlParams.singleCompanyAddressesId, {
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
            "companyId",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const companyId = Array.isArray(res.companyId)
          ? res.companyId.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.companyId
            ? [{ _id: res.companyId._id, name: res.companyId.name }]
            : [];
        setCompanyId(companyId);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "CompanyAddresses",
          type: "error",
          message: error.message || "Failed get companyAddresses",
        });
      });
  }, [props, urlParams.singleCompanyAddressesId]);

  const goBack = () => {
    navigate("/companyAddresses");
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
              <h3 className="m-0">Company Addresses</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>companyAddresses/{urlParams.singleCompanyAddressesId}</p> */}
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
                <label className="text-sm text-gray-600">Is Default</label>
                <p className="m-0">
                  <i
                    id="isDefault"
                    className={`pi ${_entity?.isDefault ? "pi-check" : "pi-times"}`}
                  ></i>
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Company</label>
                {companyId.map((elem) => (
                  <Link key={elem._id} to={`/companies/${elem._id}`}>
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
          <TabView></TabView>
        </div>

        <CommentsSection
          recordId={urlParams.singleCompanyAddressesId}
          user={props.user}
          alert={props.alert}
          serviceName="companyAddresses"
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

export default connect(mapState, mapDispatch)(SingleCompanyAddressesPage);
