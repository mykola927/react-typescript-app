import React from "react";
import { Button } from "antd";
import "./styles.scss";

export default function ContactsTab() {
  return (
    <div className="contacts-tab">
      <h2>List of Contacts</h2>
      <Button>New contact</Button>
    </div>
  );
}
