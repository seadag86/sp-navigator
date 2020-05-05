import React, { useState, useRef } from "react";
import styles from "./Menu.module.scss";
import { IconButton } from "office-ui-fabric-react";

export interface IMenuProps {
  items: IMenuItem[];
}

export interface IMenuItem {
  title: string;
  url: string;
  parentUrl: string;
  weight: number;
  children?: IMenuItem[];
}

const Menu: React.FC<IMenuProps> = ({ items }) => {
  const [leftBtnInterval, setLeftBtnInterval] = useState();
  const [rightBtnInterval, setRightBtnInterval] = useState();
  const navbar: React.MutableRefObject<HTMLUListElement> = useRef();

  const srollLeft = () => {
    const interval = setInterval(() => {
      navbar.current.scrollLeft = navbar.current.scrollLeft - 20;
    }, 100);

    setLeftBtnInterval(interval);
  };

  const scrollRight = () => {
    const interval = setInterval(() => {
      navbar.current.scrollLeft = navbar.current.scrollLeft + 20;
    }, 100);

    setRightBtnInterval(interval);
  };

  const scrollBtnRelease = () => {
    setLeftBtnInterval(clearInterval(leftBtnInterval));
    setRightBtnInterval(clearInterval(rightBtnInterval));
  };

  const activeItem = (item: IMenuItem): string => {
    return window.location.href
      .toLowerCase()
      .indexOf(item.url.toLowerCase()) !== -1
      ? "active"
      : "inactive";
  };

  const menuItemChildren = (item: IMenuItem) => {
    if (item.children && item.children.length) {
      const listItems = item.children
        .sort((a: IMenuItem, b: IMenuItem) => {
          return a.title.trim() > b.title.trim()
            ? 1
            : a.title.trim() < b.title.trim()
            ? -1
            : 0;
        })
        .map((child, i) => {
          return (
            <li
              key={i}
              className={`${styles["menu-sub-item"]} ${
                styles[activeItem(child)]
              }`}
            >
              <a href={child.url} target="_blank" title={child.title}>
                {child.title}
              </a>
              {menuItemChildren(child)}
            </li>
          );
        });

      return <ul>{listItems}</ul>;
    }
  };

  const menuItems =
    items && items.length
      ? items.map((itm, i) => {
          return (
            <li
              key={i}
              className={`${styles["menu-item"]} ${styles[activeItem(itm)]}`}
            >
              <a href={itm.url} target="_blank" title={itm.title}>
                {itm.title}
              </a>
              {menuItemChildren(itm)}
            </li>
          );
        })
      : null;

  return (
    <nav className={styles["navigator-menu"]}>
      <IconButton
        className={styles["menu-button"]}
        iconProps={{ iconName: "ChevronLeft" }}
        onMouseDown={srollLeft}
        onMouseUp={scrollBtnRelease}
      />

      <ul ref={navbar} className={styles["navbar"]}>
        {menuItems}
      </ul>

      <IconButton
        className={styles["menu-button"]}
        iconProps={{ iconName: "ChevronRight" }}
        onMouseDown={scrollRight}
        onMouseUp={scrollBtnRelease}
      />
    </nav>
  );
};

export default Menu;
