
import React from 'react';

const GoogleMap = () => {
    return (
        <div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.4107481922942!2d89.82989169999999!3d23.0086861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ffc307c075470b%3A0xe4a8d69470c2c2df!2sArshi!5e0!3m2!1sen!2sbd!4v1708253455955!5m2!1sen!2sbd"
                // width="600"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className='w-full '
            ></iframe>
        </div>

    );
};

export default GoogleMap;