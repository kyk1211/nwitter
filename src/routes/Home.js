import Nweet from 'components/Nweet';
import { dbService, storageService } from 'myBase';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService.collection("nweets")
      .orderBy("createdAt","desc")
      .onSnapshot((snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const nweetAttachment = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nweets").add(nweetAttachment);
    setNweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    const { 
      target: { value }, 
    } = e;
    setNweet(value);
  };
  const onFileChange = (e) => {
    const { 
      target: { files } ,
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { 
        currentTarget : { result },
      } = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }
  const onClearAttachment = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          value={nweet} 
          onChange={onChange} 
          type='text' 
          placeholder="What's on your mind?" 
          maxLength={120} 
        />
        <input type='file' accept='image/*' onChange={onFileChange}/>
        <input type='submit' value="nweet" />
        {attachment && (
          <div>
            <img src={attachment} width='50px' height='50px' />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet 
            key={nweet.id} 
            nweetObj={nweet} 
            isOwner={nweet.creatorId === userObj.uid} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;