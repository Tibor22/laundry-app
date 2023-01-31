import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles/main.module.css';
let socket: any;

const Home = () => {
	const [num, setNum] = useState('');
	type LaundryNumber = {
		id: number;
		laundryListId: number;
		number: number;
	};
	type WaitingList = LaundryNumber[] | [];

	const [waitingList, setWaitingList] = useState<WaitingList>([]);
	useEffect(() => {
		const socketInitializer = async () => {
			await fetch('/api/socket');
			socket = io();
			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('receive_waiting_list', (waitingList: any) => {
				setWaitingList(waitingList.waitingList);
			});
		};
		socketInitializer();
	}, []);

	useEffect(() => {
		const getList = async () => {
			const response = await fetch('/api/getList');
			const list = await response.json();
			setWaitingList(list.laundryList);
		};
		getList();
	}, []);

	const handleAddNumbers = async (e: any) => {
		e.preventDefault();

		if (isNaN(parseInt(num, 10))) return;
		const response = await fetch('/api/getList', {
			method: 'POST',
			body: JSON.stringify({ number: num }),
		});

		const list = await response.json();
		socket.emit('send_waiting_list', {
			waitingList: list.laundryList,
		});
		setWaitingList(list.laundryList);
	};

	const handleNext = async () => {
		if (waitingList.length <= 0) return;
		const response = await fetch(`/api/getList?id=${waitingList[0].id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_waiting_list', {
			waitingList: list.laundryList,
		});
		setWaitingList(list.laundryList);
	};

	const removeItem = async (id: string) => {
		const response = await fetch(`/api/getList?id=${id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_waiting_list', {
			waitingList: list.laundryList,
		});
		setWaitingList(list.laundryList);
	};

	return (
		<main className={styles.main}>
			<div className={styles.center}>
				<h1 className={styles.header}>LAUNDRY BUZZER</h1>
				<p className={styles.currNum}>
					Current number is: <strong>{waitingList[0]?.number || ''}</strong>
				</p>
				<div className={styles.waiting}>
					<h2>Waiting:</h2>
					<ul>
						{waitingList.slice(1).map((number) => {
							return (
								<li key={number.id} className={styles.item}>
									{number.number}{' '}
									<span onClick={() => removeItem(number.id)}>X</span>
								</li>
							);
						})}
					</ul>
				</div>

				<div onClick={handleNext} className={styles.btn}>
					NEXT
				</div>

				<form className={styles.form}>
					<input
						className={styles.add_input}
						placeholder='Add you number to the waiting list'
						onChange={(event) => {
							setNum(event.target.value);
						}}
						value={num}
					/>
					<button
						className={styles.button}
						onClick={(e) => handleAddNumbers(e)}
					>
						Add Number
					</button>
				</form>
			</div>
		</main>
	);
};

export default Home;
