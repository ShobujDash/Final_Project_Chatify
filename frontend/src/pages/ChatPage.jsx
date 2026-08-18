import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useEffect } from "react";

function ChatPage() {
  const { activeTab, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="relative w-full max-w-6xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div
          className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex-col ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className={`flex-1 bg-slate-900/50 backdrop-blur-sm flex-col ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
