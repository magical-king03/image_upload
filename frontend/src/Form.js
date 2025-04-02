import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !file) {
            alert('Please provide both name and file.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        try {
            const response = await axios.post('https://image-upload-5nfs.onrender.com/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            console.log(response.data);
            setName('');
            setFile(null);
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
            <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default Form;
