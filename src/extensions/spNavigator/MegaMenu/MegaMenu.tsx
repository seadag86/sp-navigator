import React from "react";
import styles from "./MegaMenu.module.scss";

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

const MegaMenu: React.FC<IMenuProps> = ({ items }) => {
  const activeItem = (item: IMenuItem): string => {
    return window.location.href
      .toLowerCase()
      .indexOf(item.url.toLowerCase()) !== -1
      ? "active"
      : "inactive";
  };

  const menuItemChildren = (item: IMenuItem) => {
    if (item.children && item.children.length) {
      const listItems = item.children.map((child, i) => {
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

  const rootSite = (item: IMenuItem) => (
    <li
      className={`${styles["menu-sub-item"]} ${styles["menu-item-home"]} ${
        styles[activeItem(item)]
      }`}
    >
      <a href={item.url} target="_blank" title="Home">
        Home
      </a>
    </li>
  );

  const menuItems =
    items && items.length
      ? items
          .sort((a: IMenuItem, b: IMenuItem) => {
            return a.title.trim() > b.title.trim()
              ? 1
              : a.title.trim() < b.title.trim()
              ? -1
              : 0;
          })
          .map((itm, i) => {
            return (
              <li
                key={i}
                className={`${styles["menu-item"]} ${styles[activeItem(itm)]}`}
              >
                <a href={itm.url} target="_blank" title={itm.title}>
                  {itm.title}
                </a>
                {rootSite(itm)}
                {menuItemChildren(itm)}
              </li>
            );
          })
      : null;

  return <ul className={styles["navbar"]}>{menuItems}</ul>;
};

export default MegaMenu;
