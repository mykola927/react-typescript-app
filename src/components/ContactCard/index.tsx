import React from "react";
import "./styles.scss";

interface Props {
  contactName: string;
  contactId: string;
  contactImage: string;
  onClick?: () => void;
}

export default function ContactCard(props: Props) {
  const { contactName, contactId, contactImage, onClick } = props;
  return (
    <div className="contact-card" onClick={onClick}>
      <div className="contact-card__image">
        <div
          style={{
            backgroundImage: `url('${contactImage}')`,
            backgroundSize: "cover",
          }}
        >
          {contactImage ? null : contactName[0]}
        </div>
      </div>
      <div className="contact-card__name">{contactName}</div>
    </div>
  );
}
