import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Memes from "./items/memes";
import Following from "./items/following";
import Followers from "./items/followers";
const Statics = ({userData}) => {
  return (
    <div className="mt-6 ">
      <Tabs defaultValue="memes" className="">
        <TabsList className="flex justify-between absolute w-full left-0">
          <TabsTrigger value="memes" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Memes</span>
              <span className="font-semibold">{userData.memes || 0}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Following</span>
              <span className="font-semibold">{userData.Following || 0}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="followers" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Followers</span>
              <span className="font-semibold">{userData.Followers || 0}</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="memes" className="pt-18">
          <Memes userId={userData.id}/>
        </TabsContent>
        <TabsContent value="following" className="pt-18">
          <Following />
        </TabsContent>
        <TabsContent value="followers"className="pt-18">
          <Followers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statics;

