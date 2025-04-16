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

import DepartmentAdminPage from "../DepartmentAdminPage/DepartmentAdminPage";

const SingleEmployeesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [section, setSection] = useState([]);
  const [position, setPosition] = useState([]);
  const [supervisor, setSupervisor] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("employees")
      .get(urlParams.singleEmployeesId, {
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
            "company",
            "department",
            "section",
            "position",
            "supervisor",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const company = Array.isArray(res.company)
          ? res.company.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.company
            ? [{ _id: res.company._id, name: res.company.name }]
            : [];
        setCompany(company);
        const department = Array.isArray(res.department)
          ? res.department.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.department
            ? [{ _id: res.department._id, name: res.department.name }]
            : [];
        setDepartment(department);
        const section = Array.isArray(res.section)
          ? res.section.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.section
            ? [{ _id: res.section._id, name: res.section.name }]
            : [];
        setSection(section);
        const position = Array.isArray(res.position)
          ? res.position.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.position
            ? [{ _id: res.position._id, name: res.position.name }]
            : [];
        setPosition(position);
        const supervisor = Array.isArray(res.supervisor)
          ? res.supervisor.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.supervisor
            ? [{ _id: res.supervisor._id, name: res.supervisor.name }]
            : [];
        setSupervisor(supervisor);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Employees",
          type: "error",
          message: error.message || "Failed get employees",
        });
      });
  }, [props, urlParams.singleEmployeesId]);

  const goBack = () => {
    navigate("/employees");
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
              <h3 className="m-0">Employees</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>employees/{urlParams.singleEmployeesId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Emp No</label>
                <p className="m-0 ml-3">{_entity?.empNo}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Name</label>
                <p className="m-0 ml-3">{_entity?.name}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Fullname</label>
                <p className="m-0 ml-3">{_entity?.fullname}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Date Joined</label>
                <p id="dateJoined" className="m-0 ml-3">
                  {_entity?.dateJoined}
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Date Terminated</label>
                <p id="dateTerminated" className="m-0 ml-3">
                  {_entity?.dateTerminated}
                </p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Resigned</label>
                <p className="m-0 ml-3">{_entity?.resigned}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Emp Group</label>
                <p className="m-0 ml-3">{_entity?.empGroup}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Emp Code</label>
                <p className="m-0 ml-3">{_entity?.empCode}</p>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Company</label>
                {company.map((elem) => (
                  <Link key={elem._id} to={`/companies/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Department</label>
                {department.map((elem) => (
                  <Link key={elem._id} to={`/departments/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Section</label>
                {section.map((elem) => (
                  <Link key={elem._id} to={`/sections/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Position</label>
                {position.map((elem) => (
                  <Link key={elem._id} to={`/positions/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-10">
                <label className="text-sm text-gray-600">Supervisor</label>
                {supervisor.map((elem) => (
                  <Link key={elem._id} to={`/employees/${elem._id}`}>
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
                  <DepartmentAdminPage />
                </TabPanel>
              </TabView>
            </div>
          </TabView>
        </div>

        <CommentsSection
          recordId={urlParams.singleEmployeesId}
          user={props.user}
          alert={props.alert}
          serviceName="employees"
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

export default connect(mapState, mapDispatch)(SingleEmployeesPage);
