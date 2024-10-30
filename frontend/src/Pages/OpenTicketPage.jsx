import React, { useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import './CSS/OpenTicketPage.css'

const OpenTicketPage = () => {
    const [orderId, setOrderId] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [decision, setDecision] = useState('');

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!orderId || !description || !image) {
            setMessage('Please fill in all fields and upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:8080/myservlet/validate_ticket_and_create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
                setDecision(''); 
                return;
            }

            const data = await response.json();
            setMessage(data.message);
            setDecision(data.decision);

            if(data.ticketNumber){
                alert(`Ticket Number: ${data.ticketNumber} keep with you for futher checking`)
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setDecision('');
        }
    };

    return (
        <>
        <Navbar/>
        <div className="open-ticket-page">
            <h2>Create a Ticket</h2>
            <form  className='open-form'onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="orderId">Order ID:</label>
                    <input
                        type="text"
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button className='open-btn'type="submit">Submit</button>
            </form>
            {/* {message && <p>{message}</p>}
            {decision && (
                <div>
                    <h3>Decision</h3>
                    <p>{decision}</p>
                </div>
            )} */}
        </div>
        </>
    );
};

export default OpenTicketPage;
