import { useState } from "react";
import { classNames } from "primereact/utils";

import AppMenu from "./AppMenu.js";
import AppFooter from "../AppFooter.js";
import AppSideBarProvider from "./AppSideBarProvider.js";
import Toggle from "../../../assets/icons/Toggle.js";

import Home from "../../../assets/icons/Home.js";
import Data from "../../../assets/icons/Data.js";
import Messaging from "../../../assets/icons/Messaging.js";
import Report from "../../../assets/icons/Report.js";
import GenAI from "../../../assets/icons/GenAI.js";
import StaffInfo from "../../../assets/icons/StaffInfo.js";
import Stack from "../../../assets/icons/Stack.js";
import DynaLoader from "../../../assets/icons/DynaLoader.js";
import Server from "../../../assets/icons/Server.js";
import Email from "../../../assets/icons/Email.js";
import MailSent from "../../../assets/icons/MailSent.js";
import Load from "../../../assets/icons/Load.js";
import Chat from "../../../assets/icons/Chat.js";
import Terminal from "../../../assets/icons/Terminal.js";
import Documents from "../../../assets/icons/Documents.js";
import Admin from "../../../assets/icons/Admin.js";
import Users from "../../../assets/icons/Users.js";

import Building from "../../../assets/icons/Building.js";
import Profile from "../../../assets/icons/Profile.js";
import Profiles from "../../../assets/icons/Profiles.js";
import Employees from "../../../assets/icons/Employees.js";
import UserLogin from "../../../assets/icons/UserLogin.js";
import Superiors from "../../../assets/icons/Superiors.js";
import Roles from "../../../assets/icons/Roles.js";
import Positions from "../../../assets/icons/Positions.js";
import Addresses from "../../../assets/icons/Addresses.js";
import Phones from "../../../assets/icons/Phones.js";
import Companies from "../../../assets/icons/Companies.js";
import Branches from "../../../assets/icons/Branches.js";
import Sections from "../../../assets/icons/Sections.js";
import Permissions from "../../../assets/icons/Permissions.js";
import HeadOfSection from "../../../assets/icons/HeadOfSection.js";
import HeadOfDept from "../../../assets/icons/HeadOfDept.js";
import DepartmentAdmin from "../../../assets/icons/DepartmentAdmin.js";
import Files from "../../../assets/icons/Files.js";
import Tests from "../../../assets/icons/Tests.js";
import Errors from "../../../assets/icons/Errors.js";
// ~cb-add-import~

const AppSideBar = (props) => {
  const { activeKey: initialActiveKey, activeDropdown: initialActiveDropdown } =
    props;
  const [activeKey, setActiveKey] = useState(initialActiveKey);
  const [activeDropdown, setActiveDropdown] = useState(initialActiveDropdown);
  const [open, setOpen] = useState(true);
  return (
    <>
      <div
        className={classNames(
          "duration-300 flex-shrink-0",
          open ? "w-[280px]" : "w-[calc(3rem+20px)]",
        )}
      ></div>
      <AppSideBarProvider
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        open={open}
        setOpen={setOpen}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      >
        <div
          className={classNames(
            "fixed z-[100] flex flex-col top-20 left-0 h-[calc(100vh-5rem)] overflow-y-hidden overflow-x-hidden  flex-shrink-0 shadow bg-[#F8F9FA] border-r border-[#DEE2E6] border-solid duration-300",
            open ? "w-[280px]" : "w-[calc(3rem+20px)]",
          )}
        >
          <div className="flex-grow gap-1 p-2 overflow-x-hidden overflow-y-auto no-scrollbar">
            <div className="flex gap-3 px-3 py-[10px]">
              <span className="cursor-pointer" onClick={() => setOpen(!open)}>
                <Toggle />
              </span>
            </div>
            <AppMenu
              icon={<Home />}
              label="My app"
              menuKey="dashboard"
              to="/dashboard"
              menus={[
                {
                  icon: <Home />,
                  label: "Items",
                  menuKey: "items",
                  to: "/items",
                },
                {
                  icon: <Home />,
                  label: "Invoices",
                  menuKey: "invoices",
                  to: "/invoices",
                },
                /* ~cb-add-menu~ */
              ]}
            />

            <AppMenu
              icon={<Admin />}
              label="People"
              menuKey="hr-controls"
              to="/DashboardAdminControl"
              menus={[
                {
                  label: "Roles",
                  icon: <Roles />,
                  menuKey: "roles",
                  to: "/roles",
                },
                {
                  label: "Positions",
                  icon: <Positions />,
                  menuKey: "positions",
                  to: "/positions",
                },

                {
                  icon: <DepartmentAdmin />,
                  label: "Department admins",
                  menuKey: "department-admin",
                  to: "/departmentAdmin",
                },
                {
                  icon: <HeadOfDept />,
                  label: "Head of departments",
                  menuKey: "head-of-department",
                  to: "/departmentHOD",
                },
                {
                  icon: <HeadOfSection />,
                  label: "Head of sections",
                  menuKey: "haed-of-section",
                  to: "/departmentHOS",
                },
                {
                  label: "Superiors",
                  icon: <Superiors />,
                  menuKey: "superiors",
                  to: "/Superior",
                },
                {
                  label: "Employees",
                  icon: <Employees />,
                  menuKey: "employees",
                  to: "/Employees",
                },
                {
                  label: "Staff infos",
                  icon: <StaffInfo />,
                  menuKey: "staff-info",
                  to: "/Staffinfo",
                },
                {
                  icon: <Permissions />,
                  label: "Permissions",
                  menuKey: "service-permissions",
                  to: "/permissionServices",
                },
              ]}
              setActiveKey={setActiveKey}
            />
            <AppMenu
              icon={<Data />}
              label="Data"
              menuKey="data-management"
              to="/DashboardDataManagement"
              menus={[
                {
                  label: "DynaLoader",
                  icon: <DynaLoader />,
                  menuKey: "dyna-loader",
                  to: "/dynaLoader",
                },

                {
                  label: "Documents",
                  icon: <Documents />,
                  menuKey: "documents",
                  to: "/documentStorages",
                },
                {
                  label: "Assets",
                  icon: <Files />,
                  menuKey: "assets",
                },
                {
                  label: "Email templates",
                  icon: <Email />,
                  menuKey: "email-templates",
                  to: "/templates",
                },
              ]}
              setActiveKey={setActiveKey}
            />
            <AppMenu
              icon={<GenAI />}
              label="Gen Ai"
              menuKey="gen-ai"
              menus={[
                {
                  label: "Chat AI",
                  icon: <Chat />,
                  menuKey: "chat-ai",
                  to: "/chataiProject",
                },
                {
                  label: "Prompts",
                  icon: <Terminal />,
                  menuKey: "prompts",
                  to: "/prompts",
                },
                {
                  label: "Usage",
                  icon: <Documents />,
                  menuKey: "usage",
                  to: "/chataiUsage",
                },
              ]}
            />
            <AppMenu
              icon={<Users />}
              label="Users"
              menuKey="user-management"
              to="/DashboardUserManagement"
              menus={[
                {
                  label: "Users",
                  icon: <Profile />,
                  menuKey: "users",
                  to: "/users",
                },
                {
                  label: "Profiles",
                  icon: <Profiles />,
                  menuKey: "profiles",
                  to: "/profiles",
                },
                {
                  label: "Invites",
                  icon: <MailSent />,
                  menuKey: "user-invites",
                  to: "/userInvites",
                },
                {
                  label: "Logins",
                  icon: <UserLogin />,
                  menuKey: "user-logins",
                  to: "/userLogin",
                },

                {
                  label: "Addresses",
                  icon: <Addresses />,
                  menuKey: "addresses",
                  to: "/userAddresses",
                },
                {
                  label: "Phones",
                  icon: <Phones />,
                  menuKey: "phones",
                  to: "/userPhones",
                },
              ]}
              setActiveKey={setActiveKey}
            />
            <AppMenu
              icon={<Building />}
              label="Company"
              menuKey="company-management"
              to="/DashboardCompanyData"
              menus={[
                {
                  label: "Companies",
                  icon: <Companies />,
                  menuKey: "companies",
                  to: "/companies",
                },
                {
                  label: "Branches",
                  icon: <Branches />,
                  menuKey: "branches",
                  to: "/branches",
                },
                {
                  label: "Departments",
                  icon: <Positions />,
                  menuKey: "departments",
                  to: "/departments",
                },
                {
                  label: "Sections",
                  icon: <Sections />,
                  menuKey: "sections",
                  to: "/sections",
                },
                {
                  label: "Addresses",
                  icon: <Addresses />,
                  menuKey: "company-addresses",
                  to: "/companyAddresses",
                },
                {
                  label: "Phones",
                  icon: <Phones />,
                  menuKey: "company-phones",
                  to: "/companyPhones",
                },
              ]}
              setActiveKey={setActiveKey}
            />
            <AppMenu
              icon={<Admin />}
              label="Admin"
              menuKey="admin-controls"
              to="/DashboardAdminControl"
              menus={[
                {
                  label: "Reports",
                  icon: <Report />,
                  menuKey: "generate-reports",
                },
                {
                  label: "Scheduler",
                  icon: <Load />,
                  menuKey: "scheduler",
                },

                {
                  label: "Test jobs",
                  menuKey: "test-jobs",
                  icon: <Tests />,
                  // to: "/tests",
                },
                {
                  label: "DynaLoader jobs",
                  icon: <DynaLoader />,
                  menuKey: "job-ques",
                  to: "/jobQues",
                },
                {
                  label: "Mail jobs",
                  icon: <Email />,
                  menuKey: "mail-job-ques",
                  to: "/mailQues",
                },
                {
                  label: "Mail logs",
                  icon: <MailSent />,
                  menuKey: "mail-sent-logs",
                  to: "/mails",
                },
                {
                  label: "Error logs",
                  menuKey: "errors",
                  icon: <Errors />,
                  to: "/errorLogs",
                },
              ]}
              setActiveKey={setActiveKey}
            />
          </div>
          <div
            className={classNames(
              "text-center duration-300",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <AppFooter />
          </div>
        </div>
      </AppSideBarProvider>
    </>
  );
};

export default AppSideBar;
