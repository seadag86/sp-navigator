import React, { useState } from "react";
import { Modal, IconButton, PrimaryButton } from "office-ui-fabric-react";
import MegaMenu from "../MegaMenu/MegaMenu";
import { IMenuItem } from "../Menu/Menu";
import { Manager } from "../Manager/Manager";
import styles from "./Overlay.module.scss";

export interface IMenuOverlayProps {
  expanded: boolean;
  items: IMenuItem[];
  onCloseModal: () => void;
}

const Overlay: React.FC<IMenuOverlayProps> = ({
  expanded,
  items,
  onCloseModal
}) => {
  const [toggleManager, setToggleManager] = useState(false);

  const onCloseModalButtonClick = () => {
    onCloseModal();
  };

  const onEditButtonClick = () => {
    setToggleManager(!toggleManager);
  };

  const showComponent = toggleManager ? (
    <Manager items={items} />
  ) : (
    <MegaMenu items={items} />
  );

  return (
    <Modal isOpen={expanded} containerClassName={styles["overlay-container"]}>
      <div className={styles["overlay-header"]}>
        <IconButton
          className={styles["close-button"]}
          iconProps={{ iconName: "Cancel" }}
          ariaLabel="Close popup modal"
          onClick={onCloseModalButtonClick}
        />
      </div>

      {showComponent}

      <div className={styles["overlay-footer"]}>
        <button
          className="ms-Button ms-Button--default root-106"
          onClick={onEditButtonClick}
        >
          {toggleManager ? "Save" : "Edit"}
        </button>
        <PrimaryButton text="Close" onClick={onCloseModalButtonClick} />
      </div>
    </Modal>
  );
};

export default Overlay;
