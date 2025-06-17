import { getTest } from "./server/database/getData";


export default async function Home() {
  const tst = await getTest();
  return (
    <div className="">
      gdgdgdgd
    </div>
  );
}
