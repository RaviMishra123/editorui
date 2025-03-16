import React, { useState } from 'react';
import './style.css';

const UserInput = ({ onInput }) => {
	const [inputValue, setInputValue] = useState('');
	const [submittedData, setSubmittedData] = useState(null);

	const handleChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter' && inputValue.trim()) {
			event.preventDefault();
			onInput(inputValue);
			setSubmittedData(inputValue);
			setInputValue('');
		}
	};

	return (
		<div>
			<textarea
				value={inputValue}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				placeholder="Enter your input and run code again..."
				rows={4}
				cols={50}
				className="user-input-textarea"
				style={{ fontFamily: 'monospace' }}
			/>
		</div>
	);
};

export default UserInput;
