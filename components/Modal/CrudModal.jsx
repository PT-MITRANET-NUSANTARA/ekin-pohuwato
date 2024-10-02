import { Modal } from 'antd';
import React from 'react';

const CrudModal = ({ isModalOpen, data }) => {

    return (
        <Modal title="Basic Modal" open={isModalOpen} onc>
           {data ? ( // Check if data is not null
                <>
                    <p>Name: {data.name}</p>
                    <p>Age: {data.age}</p>
                    <p>Address: {data.address}</p>
                </>
            ) : (
                <p>No data available</p> // Fallback for no data
            )}
        </Modal>
    );
};

export default CrudModal;
