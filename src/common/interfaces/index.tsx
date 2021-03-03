export interface ContactInterface {
  uid: string;
  photoURL: string;
  contactName: string;
}

export interface ConversationInterface {
  id: string;
  groupName: string;
  createdBy: string;
  photoURL: string;
  users: string[];
}
