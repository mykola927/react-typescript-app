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
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/react-typescript-chat-ap-d6740.appspot.com/o/images%2Fcute-cat-couple.png?alt=media&token=9f720d76-1e3f-43d9-95c5-e61f4e7f51c0')`,
            backgroundSize: "cover",
          }}
        >
          {conversationName[0]}
        </div>
      </div>
      <div className="conversation-card__name">{conversationName}</div>
    </div>
  );
}
