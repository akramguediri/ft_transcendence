import React from 'react'
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
  }, []);
  return (
    <div><h1>HomePage </h1>
    <h1>Hello, {userName}!</h1>
    </div>
  )
}

export default HomePage