import React, { useEffect, useState } from 'react'
import GetCSRFToken from '../getCSRFToken'

const Get42Token = (code) => {
    const [token, setToken] = useState('')

    useEffect(() => {
        const fetchAccessToken = async () => {
            try{
                const response = await fetch( 'http://127.0.0.1:8000/usermanagement/get42token' ,
                {
                    method: 'POST',
                    body: JSON.stringify({ code }),
                    headers: {
                        'X-CSRFToken': await GetCSRFToken(),
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json();
                if (data.error) {
                    console.error(data.error);
                } else {
                    localStorage.setItem('user', JSON.stringify(data));
                    // Redirect to authenticated page
                    window.location.href = '/home-page';
                }
            }
            catch (error) {
                console.error('Error fetching access token:', error);
            }
        };
        if (code) fetchAccessToken();
    }, [code]);

  return { token }
}

export default Get42Token