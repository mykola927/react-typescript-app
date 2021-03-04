import { Button } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import "./styles.scss";

interface Props {
  contact: any;
  onClick?: () => void;
  handleRemoveContact?: (contactId: string) => void;
  handleEditingContact?: any;
}

export default function ContactCard(props: Props) {
  const { contact, onClick, handleRemoveContact, handleEditingContact } = props;

  return (
    <>
      <div className="contact-card" onClick={onClick}>
        <div className="contact-card__image">
          <div
            style={{
              backgroundImage: `url('${contact.photoURL}')`,
              backgroundSize: "cover",
            }}
          >
            {contact.photoURL ? null : contact.contactName[0]}
          </div>
        </div>
        <div className="contact-card__name">
          <span style={{ marginRight: "auto" }}>{contact.contactName}</span>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined style={{ color: "#555" }} />}
            onClick={() =>
              handleEditingContact(contact.contactName, contact.uid)
            }
          />
          <Button
            type="text"
            shape="circle"
            icon={<CloseOutlined style={{ color: "#555" }} />}
            onClick={() =>
              handleRemoveContact && handleRemoveContact(contact.uid)
            }
          />
        </div>
      </div>
    </>
  );
}
