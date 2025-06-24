"use client";

import { useEffect, useState } from "react";

const Meme = ({ params }) => {
  const [memes, setmemes] = useState();

  useEffect(() => {
    const fetchMeme = async () => {
      const { meme } = await params;
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meme),
        credentials: "include",
      });
      
      const data = await res.json();
      console.log(data);
      setmemes(data);
    };

    fetchMeme();
  }, [params]);
  return <div>Meme :</div>;
};

export default Meme;
