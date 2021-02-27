import React from "react";
import "./styles.scss";

interface Props {
  contactName: string;
  contactImage?: string;
  onClick?: () => void;
}

export default function SelectedContactPill(props: Props) {
  const { contactName, contactImage, onClick } = props;
  return (
    <div className="pill-container">
      <div className="selected-contact-pill">
        <span
          className="selected-contact-pill__image"
          style={{
            backgroundImage: `url('${contactImage}')`,
            backgroundSize: "cover",
          }}
        >
          {contactImage ? null : contactName[0]}
        </span>
        <div className="selected-contact-pill__name">{contactName}</div>
        <div className="selected-contact-pill__remove" onClick={onClick}>
          X
        </div>
      </div>
    </div>
  );
}
