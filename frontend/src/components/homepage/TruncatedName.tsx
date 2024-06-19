import React from 'react';

interface TruncatedNameProps {
    name: string;
}

const TruncatedName: React.FC<TruncatedNameProps> = ({ name }) => {
    // Check if name is defined and has a length property
    const truncatedName = name && name.length > 15 ? `${name.slice(0, 20)}...` : name;

    return <>{truncatedName}</>;
};

export default TruncatedName;
