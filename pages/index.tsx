import { useEffect, useState } from 'react';
import io from 'Socket.IO-client';
let socket: any;

const Home = () => {
	const [input, setInput] = useState('');

	useEffect(() => {
		const socketInitializer = async () => {
			await fetch('/api/socket');
			socket = io();

			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('update-input', (msg) => {
				setInput(msg);
			});
		};
		socketInitializer();
	}, []);

	const onChangeHandler = (e) => {
		setInput(e.target.value);
		socket.emit('input-change', e.target.value);
	};

	return (
		<main className='main'>
			<input
				placeholder='Type something'
				value={input}
				onChange={onChangeHandler}
			/>
		</main>
	);
};

export default Home;
