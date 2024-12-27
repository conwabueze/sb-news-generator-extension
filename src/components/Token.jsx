import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


export default function Token({ sbTokenInStorage, setSbTokenInStorage }) {
    const navigate = useNavigate();

    async function tokenSubmit(e) {
        e.preventDefault();

        try {
            
            await chrome.storage.local.set({ sbToken: e.target.token.value }, () => {
                console.log(`Token saved: ${e.target.token.value}`)
                console.log('Token saved successfully');
            });
            setSbTokenInStorage(true);
            if (sbTokenInStorage) {
                navigate('/menu');
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <form className="token-form" onSubmit={tokenSubmit}>
                <div className="form-field">
                    <label htmlFor="token">Start by providing me your API Token</label>
                    <input
                        type="text"
                        id="token"
                        name="token"
                        placeholder='ex: Njc0OGU3Yjh...'
                    //onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}