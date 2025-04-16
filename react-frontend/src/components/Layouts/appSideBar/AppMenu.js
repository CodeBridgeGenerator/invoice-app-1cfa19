import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useAppSideBar } from "./AppSideBarProvider";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";

const AppMenu = (props) => {
  const { menus, menuKey, icon, label, to, overlayMenu } = props;
  const { activeKey, setActiveKey, open, activeDropdown } = useAppSideBar();
  const [menuExpand, setMenuExpand] = useState(activeDropdown === menuKey);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    modifiers: [{ name: "offset", options: { offset: [0, 30] } }],
    strategy: "fixed",
  });

  const active = activeKey === menuKey;
  const haveChildren = menus && menus.length > 0;

  const handleMouseEnter = () => {
    setPopperOpen(true);
  };

  const handleMouseLeave = () => {
    setPopperOpen(false);
  };

  return (
    <>
      <Link
        to={to}
        className={classNames(
          "flex items-center justify-between py-[10px] px-3 rounded-md duration-300 group",
          active ? "bg-[#F8ECEC]" : "bg-transparent",
        )}
        onClick={() => {
          if (haveChildren) {
            open && setMenuExpand(!menuExpand);
            return;
          }
          setActiveKey(menuKey);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-3">
          <span
            ref={setReferenceElement}
            className={classNames(
              "duration-300 group-hover:text-primary",
              active ? "text-primary" : "text-secondary",
            )}
          >
            {icon}
          </span>
          <p
            className={classNames(
              "font-semibold duration-300 text-nowrap group-hover:text-primary",
              active ? "text-primary" : "text-secondary",
              open || overlayMenu ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </p>
        </div>
        {(open || overlayMenu) && haveChildren && (
          <i
            className={classNames(
              "text-xs duration-300 pi pi-chevron-down",
              active ? "text-primary" : "text-secondary",
              menuExpand ? "rotate-180" : "",
            )}
          ></i>
        )}
      </Link>
      <div
        className={classNames("overflow-hidden transition-all duration-300")}
        style={{
          height:
            (open || overlayMenu) && haveChildren && menuExpand
              ? `${menus.length * 47}px`
              : "0px",
        }}
      >
        <div className="flex flex-col gap-1 pl-5">
          {menus &&
            menus.map(({ menus, ...menu }, index) => (
              <AppMenu key={index} {...menu} />
            ))}
        </div>
      </div>
      {!open && haveChildren && (
        <AnimatePresence>
          {popperOpen && (
            <motion.div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="px-3 py-1 bg-white rounded-md shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, delay: 0.1 }}
            >
              <Link
                to={to}
                className={classNames(
                  "flex items-center justify-between py-[10px] px-3 rounded-md duration-300 group",
                  active ? "bg-[#F8ECEC]" : "bg-transparent",
                )}
              >
                <div className="flex gap-3">
                  <span
                    className={classNames(
                      "duration-300 group-hover:text-primary",
                      active ? "text-primary" : "text-secondary",
                    )}
                  >
                    {icon}
                  </span>
                  <p
                    className={classNames(
                      "font-semibold duration-300 text-nowrap group-hover:text-primary",
                      active ? "text-primary" : "text-secondary",
                      !open ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {label}
                  </p>
                </div>
              </Link>
              <div
                className={classNames(
                  "overflow-hidden transition-all duration-300",
                )}
              >
                <div className="flex flex-col gap-1 pl-3">
                  {menus &&
                    menus.map(({ menus, ...menu }, index) => (
                      <AppMenu key={index} {...menu} overlayMenu />
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default AppMenu;
