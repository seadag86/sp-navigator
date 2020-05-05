import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import React, { Fragment, useEffect, useState } from "react";
import { Stack, IconButton } from "office-ui-fabric-react";
import styles from "./App.module.scss";
import MenuService from "./Menu/menu.service";
import Menu, { IMenuItem } from "./Menu/Menu";
import Overlay from "./Overlay/Overlay";

export interface IAppProps {
  context: ApplicationCustomizerContext;
}

const App: React.FC<IAppProps> = ({ context }: IAppProps) => {
  const spoService = new MenuService(context);
  const [menuItems, setMenuItems] = useState<IMenuItem[] | undefined>();
  const [fullScreenIcon, setFullScreenIcon] = useState<string>("FullScreen");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandMenuIcon, setExpandMenuIcon] = useState<string>("CollapseMenu");

  useEffect(() => {
    (async function() {
      const itemsFromService = await spoService.buildMenuItems();
      setMenuItems(itemsFromService);
    })();
  }, []);

  const expandMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullScreen = () => {
    const suitebar: HTMLElement = document.getElementById(
      "SuiteNavPlaceHolder"
    );
    const header: HTMLDivElement = document.querySelector(
      'div[class^="mainHeader"]'
    );
    const sidebar: HTMLDivElement = document.querySelector(
      'div[class^="spNav"]'
    );

    setIsFullScreen(!isFullScreen);

    if (isFullScreen) {
      suitebar.style.display = "block";
      header.style.display = "flex";
      sidebar.style.display = "flex";
      setFullScreenIcon("BackToWindow");
    }
    if (!isFullScreen) {
      suitebar.style.display = "none";
      header.style.display = "none";
      sidebar.style.display = "none";
      setFullScreenIcon("FullScreen");
    }
  };

  const toggleModal = () => {
    setIsExpanded(!isExpanded);

    if (isExpanded) {
      setExpandMenuIcon("CollapsedMenu");
    }
    if (!isExpanded) {
      setExpandMenuIcon("Cancel");
    }
  };

  return (
    <Fragment>
      <Stack
        className={styles["navigator-container"]}
        horizontal
        horizontalAlign="space-between"
      >
        <IconButton
          className={styles["menu-button"]}
          iconProps={{ iconName: expandMenuIcon }}
          onClick={expandMenu}
        />
        <Menu items={menuItems} />
        <IconButton
          className={styles["menu-button"]}
          iconProps={{ iconName: fullScreenIcon }}
          onClick={toggleFullScreen}
        />
      </Stack>

      <Overlay
        expanded={isExpanded}
        onCloseModal={toggleModal}
        items={menuItems}
      />
    </Fragment>
  );
};

export default App;
