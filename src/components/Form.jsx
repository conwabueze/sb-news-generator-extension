import Loading from "./Loading";
import axios from 'axios';
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useState, useEffect } from 'react'
import GreenCheck from '../assets/GreenCheck.svg'

export default function Form({ newsType }) {

    const [availableChannels, setAvailableChannels] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('form-error-inactive');
    const [serverError, setServerError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [returnData, setReturnData] = useState({});

    useEffect(() => {
        async function getAvailableChannels() {
            try {
                //const result = await chrome.storage.local.get('sbToken');


                const url = `https://app.staffbase.com/api/channels/`;
                //const sbToken = result.sbToken;
                const sbToken = '';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Basic ${sbToken}`
                    }
                })
                const channelsArr = response.data.data;
                const channelDropdown = [];
                const channelIDs = [];
                const options = channelsArr.map((channel) => {
                    if (channel.contentType === newsType) {
                        return <option key={channel.id} value={channel.id}>{channel.config.localization.en_US.title}</option>
                    }
                })
                setAvailableChannels(options);

            } catch (error) {
                console.error(error);
            }
        }
        getAvailableChannels();
    }, []); // Empty dependency array ensures it runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('form-error-inactive');
        //const result = await chrome.storage.local.get('sbToken');


        try {
            //const sbToken = result.sbToken;
            const sbToken = '';

            const channelID = e.target.channelID.value;
            const linkedinURL = e.target.linkedinURL.value;
            const totalPosts = e.target.totalPosts.value;
            //const url = 'https://sb-news-generator.uc.r.appspot.com/api/v1/bulkscrape/linkedin/article';
            const url = 'http://localhost:3000/api/v1/bulkscrape/linkedin/article';

            const raw = {
                "channelID": channelID,
                "pageURL": linkedinURL,
                "totalPosts": totalPosts
            };

            const res = await axios.post(url, raw, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sbToken}`
                }
            })
            setIsLoading(false);
            setSuccess(true);
            setReturnData(res.response.data);
            console.log(returnData);

        } catch (error) {
            if (error.response.data.error === 'ERROR_PULLING_POSTS' || error.response.data.error === 'ZERO_POSTS_RETURNED') {
                setFormError('form-error-active')
            }
            setIsLoading(false);
        }

    }

    function RenderComponents() {
        if(success){ 
                return (
                    <>
                        <img className="success-image" src={GreenCheck}/>
                        <div>Staffbase was able to generate x out of y posts from LinkedIn</div>
                    </>
                )
        }
        if (!isLoading) {
            return (
                <>
                    <Link to="/" className="back-button"><AiOutlineArrowLeft /></Link>
                    <form onSubmit={handleSubmit} style={{ display: isLoading ? 'none' : 'flex' }}>
                        <div className="form-field">
                            <label htmlFor="channelID">Channel Name</label>
                            <select name="channelID" id="channels-dropdown-form">
                                {availableChannels}
                            </select>
                        </div>
                        <div className={`form-field ${formError}`}>
                            <label htmlFor="linkedinURL">LinkedIn Company URL</label>
                            <input
                                type="text"
                                id="linkedinURL"
                                name="linkedinURL"
                                placeholder="ex: 'https://www.linkedin.com/company/staffbase/'"
                                required
                            //onChange={handleChange}
                            //value="https://www.linkedin.com/company/staffbase/"

                            />
                            <span>Error: Please make sure you are using the correct company URL. If problem persist, please reach out to the SE Team</span>
                        </div>
                        <div className="form-field">
                            <label htmlFor="totalPosts">Total Posts</label>
                            <input
                                type="number"
                                id="totalPosts"
                                name="totalPosts"
                                placeholder="ex: '10, 20, 30'"
                                required
                            />
                        </div>
                        <button className="submit-button" type="submit">Generate Post</button>
                    </form>
                </>
            )
        } else if (isLoading) {
            return (
                <>
                    <div className="loading-message" style={{ display: isLoading ? 'flex' : 'none' }}><Loading /></div>
                </>
            )
        }
    }

    return (
        <>
            <RenderComponents />
        </>
    );
}