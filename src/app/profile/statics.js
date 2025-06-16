import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Statics = () => {
  return (
    <div className="mt-6 ">
      <Tabs defaultValue="memes" className="">
        <TabsList className="flex justify-between absolute w-full left-0">
          <TabsTrigger value="memes" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Memes</span>
              <span className="font-semibold">100</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Following</span>
              <span className="font-semibold">100</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="followers" className="data-[state=active]:border-b-4 data-[state=active]:border-gray-800 data-[state=active]:rounded-none data-[state=active]:bg-none data-[state=active]:shadow-none">
            <div className="flex flex-col items-center pb-3">
              <span className="font-bold">Followers</span>
              <span className="font-semibold">100</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="memes" className="pt-18">
          Make changes to your account here.gdgdgdgd
          dlkfsn dkdkdkdkdkdkdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkks sjaldalsdja jald ajdlasjdasldj adjaldsj as
        </TabsContent>
        <TabsContent value="following" className="pt-18">Change your password here.</TabsContent>
        <TabsContent value="followers"className="pt-18">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Statics;

