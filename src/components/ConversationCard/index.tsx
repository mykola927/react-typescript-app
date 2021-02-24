import React from "react";
import "./styles.scss";

interface Props {
  conversationName: string;
  conversationId: string;
  onClick?: () => void;
}

export default function ConversationCard(props: Props) {
  const { conversationName, conversationId, onClick } = props;
  return (
    <div className="conversation-card" onClick={onClick}>
      <div className="conversation-card__image">
        <div>{conversationName[0]}</div>
      </div>
      <div className="conversation-card__name">{conversationName}</div>
    </div>
  );
}
