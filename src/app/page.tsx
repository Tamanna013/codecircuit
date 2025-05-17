import CommentFeed from "../components/social/CommentFeed";
import EventRSVP from "../components/social/EventRSVP";
import ForumThreadViewer from "../components/social/ForumThreadViewer";
import MicroPostInput from "../components/social/MicroPostInput";
import PollCreator from "../components/social/PollCreator";
import PostFeed from "../components/social/PostFeed";
import GroupChat from "../components/social/GroupChat";
import QABoard from "../components/social/QABoard";
import ProfileEditor from "@/components/social/ProfileEditor";
import SocialFeed from "@/components/social/SocialFeed";
const App = () => {
  return (
    <div>
      <EventRSVP />
      <div className="h-10 w-20"></div>
      <CommentFeed />
      <div className="h-10 w-20"></div>
      <ForumThreadViewer />
      <div className="h-10 w-20"></div>
      <MicroPostInput />
      <div className="h-10 w-20"></div>
      <PollCreator />
      <div className="h-10 w-20"></div>
      <PostFeed />
      <div className="h-10 w-20"></div>
      <GroupChat />
      <div className="h-10 w-20"></div>
      <QABoard />
      <div className="h-10 w-20"></div>
      <ProfileEditor />
      <div className="h-10 w-20"></div>
      <SocialFeed />
    </div>
  )
}

export default App
