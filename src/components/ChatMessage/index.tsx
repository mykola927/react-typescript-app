import { auth } from "../../firebase";
import "./styles.scss";

interface Props {
  text: string;
  uid: string;
  createdAt?: any;
}

function toDateTime(secs: number) {
  var t = new Date(0); // Epoch
  t.setUTCSeconds(secs);
  var hours = t.getHours();
  var minutes = t.getMinutes();

  return (
    <span>
      {hours > 9 ? hours : <>0{hours}</>}:
      {minutes > 9 ? minutes : <>0{minutes}</>}
    </span>
  );
}

export default function ChatMessage(props: Props) {
  const { text, uid, createdAt } = props;

  const messageType = uid === auth.currentUser?.uid ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageType}`}>
        <div className="message__content">
          <div className="message__content__text">{text}</div>
          <p className="message__content__at">
            {createdAt && toDateTime(createdAt.seconds)}
          </p>
        </div>
      </div>
    </>
  );
}
