import React from "react";
import "./styles.scss";

interface Props {
  conversationName: string;
  conversationId: string;
  conversationImage: string;
  onClick?: () => void;
}

export default function ConversationCard(props: Props) {
  const {
    conversationName,
    conversationImage,
    conversationId,
    onClick,
  } = props;
  return (
    <div className="conversation-card" onClick={onClick}>
      <div className="conversation-card__image">
        <div
          style={{
            backgroundImage: `url('${conversationImage}')`,
            backgroundSize: "cover",
          }}
        >
          {conversationImage ? "" : conversationName[0]}
        </div>
      </div>
      <div className="conversation-card__name">{conversationName}</div>
    </div>
  );
}
