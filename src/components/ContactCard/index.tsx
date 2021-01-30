import React from "react";
import "./styles.scss";

interface Props {
  contactName: string;
  contactId: string;
  onClick?: () => void;
}

export default function ContactCard(props: Props) {
  const { contactName, contactId, onClick } = props;
  return (
    <div className="contact-card" onClick={onClick}>
      <div className="contact-card__image">
        <div>{contactName[0]}</div>
      </div>
      <div className="contact-card__name">{contactName}</div>
    </div>
  );
}
