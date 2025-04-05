import React, { useState } from 'react';

const AddressInfo = ({ onNext, onPrevious }) => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Address Information</h2>
            <input type="text" name="street" placeholder="Street" value={address.street} onChange={handleChange} />
            <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} />
            <input type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} />
            <input type="text" name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleChange} />
            <button onClick={onPrevious}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
};

export default AddressInfo;
