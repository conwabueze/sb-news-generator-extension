import { RiseLoader, BarLoader } from 'react-spinners';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from 'react-icons/ai';


export default function Loading() {
    const delay = 15000;
    const [countdown, setCountdown] = useState(delay / 1000);
    const initialMessage = `Please wait ${countdown} seconds to see if there are any issues with the LinkedIn URL you provided`;
    const [loadingMessage, setLoadingMessage] = useState(initialMessage);
    const exitMessage = 'Everything looks good. This may take sometime. Feel free to close the extension out and check back in Staffbase Studio with in the desired channel for an update.';


    useEffect(() => {
        if (countdown > 0) {
          const intervalId = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
            setLoadingMessage(loadingMessage);
          }, 1000);
          return () => clearInterval(intervalId); // Clear interval on unmount or when countdown reaches 0
        }
      }, [countdown]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingMessage(exitMessage);
        }, delay); // Delay for 2000 milliseconds (2 seconds)

        return () => clearTimeout(timer); // Clear the timeout on unmount

    }, []);
    return (
        <>
            <BarLoader className="loading-animation" cssOverride={{ width: '60%' }} color="#F5F5F5" />
            <span className='animation-caption'>Loading...</span>
            <span className='loading-caption'>{countdown!==0 ? `Please wait ${countdown} seconds to see if there issue is any issue with the URL you provided` : exitMessage}</span>
        </>
    )
}