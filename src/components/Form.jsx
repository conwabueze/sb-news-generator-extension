import Loading from "./Loading";
import axios from 'axios';
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import GreenCheck from '../assets/GreenCheck.svg';
import RedX from '../assets/RedX.svg';

export default function Form({ newsType }) {

    const [availableChannels, setAvailableChannels] = useState('');
    const [formData, setFormData] = useState({
        channelID: '',
        linkedinURL: '',
        totalPosts: 5
    })
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('form-error-inactive');
    const [serverError, setServerError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resData, setResData] = useState({
        successes: 0,
        errors: 0
    });
    const [errorResData, setErrorResData] = useState('Error Error On The Wall');

    useEffect(() => {
        async function getAvailableChannels() {
            try {
                const result = await chrome.storage.local.get('sbToken');


                const url = `https://app.staffbase.com/api/channels/`;
                const sbToken = result.sbToken;
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await chrome.storage.local.get('sbToken');


        try {
            const sbToken = result.sbToken;

            const channelID = e.target.channelID.value;
            const linkedinURL = e.target.linkedinURL.value;
            const totalPosts = e.target.totalPosts.value;
            const url = 'https://sb-news-generator.uc.r.appspot.com/api/v1/bulkscrape/linkedin/article';
            //const url = 'http://localhost:3000/api/v1/bulkscrape/linkedin/article';

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
            setResData({
                successes: res.data.data.successes,
                errors: res.data.data.errors.totalErrors
            });
            setSuccess(true);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response.data.error === 'ZERO_POSTS_RETURNED') {
                setFormError('form-error-active')
            } else {
                setServerError(true);
                setErrorResData(error.response.data.message);
            }
            setIsLoading(false);
        }

    }

    const errorBackButton = (e) => {
        setServerError(false);
    }

    return (
        <>
            {!isLoading && !success && !serverError && (
                <>
                    <Link to="/" className="back-button"><AiOutlineArrowLeft /></Link>
                    <div>
                        <form onSubmit={handleSubmit} style={{ display: isLoading ? 'none' : 'flex' }}>
                            <div className="form-field">
                                <label htmlFor="channelID">Channel Name</label>
                                <select name="channelID" onChange={handleChange} value={formData.channelID} id="channels-dropdown-form">
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
                                    value={formData.linkedinURL}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Error: Please make sure you are using the correct company URL. If problem persist, please reach out to the SE Team.</span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="totalPosts">Total Posts</label>
                                <input
                                    type="number"
                                    id="totalPosts"
                                    name="totalPosts"
                                    placeholder="ex: '10, 20, 30'"
                                    value={formData.totalPosts}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button className="submit-button" type="submit">Generate Post</button>
                        </form>
                    </div>
                </>

            )}

            {isLoading && (
                <>
                    <div className="loading-message" style={{ display: isLoading ? 'flex' : 'none' }}><Loading /></div>
                </>
            )}

            {success && (
                <>
                    <Link to="/" className="back-button"><AiOutlineArrowLeft /></Link>
                    <div><img className="success-error-image" src={GreenCheck} /></div>
                    <div className="success-error-message">{`We were able to generate ${resData.successes} posts from LinkedIn. We encounted ${resData.errors} ${resData.errors == 1 ? 'post' : 'posts'} that failed to generate during the process`}</div>
                </>
            )}

            {serverError && (
                <>
                    <Link onClick={errorBackButton} className="back-button"><AiOutlineArrowLeft /></Link>
                    <div><img className="success-error-image" src={RedX} /></div>
                    <div className="success-error-message">{errorResData}</div>
                </>
            )}
        </>
    );
}