import React from "react";
import { Modal, IconButton, PrimaryButton } from "office-ui-fabric-react";
import MegaMenu from "./MegaMenu";
import { IMenuItem } from "./Menu";
import styles from "./MenuOverlay.module.scss";

export interface IMenuOverlayProps {
  expanded: boolean;
  items: IMenuItem[];
  onCloseModal: () => void;
}

const MenuOverlay: React.FC<IMenuOverlayProps> = ({
  expanded,
  items,
  onCloseModal
}) => {
  const closeModal = () => {
    onCloseModal();
  };

  const onAutoDetectButtonClick = () => {
    console.log("auto detect was clicked");
  };

  const onSaveChangesButtonClick = () => {
    console.log("save changes was clicked");
  };

  return (
    <Modal isOpen={expanded} containerClassName={styles["overlay-container"]}>
      <div className={styles["overlay-header"]}>
        <IconButton
          className={styles["close-button"]}
          iconProps={{ iconName: "Cancel" }}
          ariaLabel="Close popup modal"
          onClick={closeModal}
        />
      </div>

      <MegaMenu items={items} />

      <div className={styles["overlay-footer"]}>
        <button
          className="ms-Button ms-Button--default root-106"
          onClick={onAutoDetectButtonClick}
        >
          Auto Detect
        </button>
        <PrimaryButton text="Save Changes" onClick={onSaveChangesButtonClick} />
      </div>
    </Modal>
  );
};

export default MenuOverlay;
