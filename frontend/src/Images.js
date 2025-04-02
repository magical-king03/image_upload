import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const SearchImage = () => {
    const [searchName, setSearchName] = useState('');
    const [images, setImages] = useState([]);

    const handleSearch = async () => {
        if (!searchName) {
            alert('Enter a name to search.');
            return;
        }

        try {
            const response = await axios.get(`https://image-upload-5nfs.onrender.com/images/${searchName}`);
            setImages(response.data.images);
        } catch (error) {
            console.error(error);
            alert('No images found');
            setImages([]);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Search Images by Name</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Name" 
                    value={searchName} 
                    onChange={(e) => setSearchName(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {images.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                    {images.map((img, index) => (
                        <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
                            <img src={img.imagePath} alt={img.name} style={{ margin:"20px", width:"90%",height:"100%"  }} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No images found</p>
            )}
        </div>
    );
};

export default SearchImage;
