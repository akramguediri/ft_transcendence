import React, { useEffect } from 'react'

const Get42UserInfo = () => {
    
    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem('user'));
        if (!userToken || !userToken.access_token) {
            console.error("No access token found.");
            return;
        }
        const accessToken = userToken.access_token;
        console.log("access token", accessToken)

        const fetchUserData = async () => {
       
        try{
            const response = await fetch('https://api.intra.42.fr/v2/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("get User data", data);
            }
        }
        catch(err){
            console.log(err)
        }
    }
    fetchUserData()
    }, [])
  return (
    <div>Get42UserInfo</div>
  )
}

export default Get42UserInfo