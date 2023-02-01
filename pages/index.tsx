import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles/main.module.css';
let socket: any;

const Home = () => {
	type LaundryNumber = {
		id: number;
		laundryListId: number;
		number: number;
	};
	type DryerNumber = {
		id: number;
		dryerListId: number;
		number: number;
	};
	type LaundryList = LaundryNumber[] | [];
	type DryerList = DryerNumber[] | [];

	type Num = {
		laundryNum?: string;
		dryerNum?: string;
	};

	const [laundryList, setLaundryList] = useState<LaundryList>([]);
	const [dryerList, setDryerList] = useState<DryerList>([]);
	const [num, setNum] = useState<Num>({});
	useEffect(() => {
		const socketInitializer = async () => {
			await fetch('/api/socket');
			socket = io();
			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('receive_laundry_list', (waitingList: any) => {
				setLaundryList(waitingList.waitingList);
			});
			socket.on('receive_dryer_list', (waitingList: any) => {
				setDryerList(waitingList.waitingList);
			});
		};
		socketInitializer();
	}, []);

	useEffect(() => {
		const getList = async () => {
			const response1 = await fetch('/api/getList');
			const list1 = await response1.json();
			const response2 = await fetch('/api/dryer');
			const list2 = await response2.json();
			setLaundryList(list1.laundryList);
			setDryerList(list2.dryerList);
		};
		getList();
	}, []);

	const handleAddLaundry = async (e: any) => {
		e.preventDefault();

		if (num.laundryNum && isNaN(parseInt(num.laundryNum, 10))) return;
		const response = await fetch('/api/getList', {
			method: 'POST',
			body: JSON.stringify({ number: num.laundryNum }),
		});

		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setLaundryList(list.laundryList);
	};
	const handleAddDryer = async (e: any) => {
		e.preventDefault();

		if (num.dryerNum && isNaN(parseInt(num.dryerNum, 10))) return;
		console.log('NUMber:', num.dryerNum);
		const response = await fetch('/api/dryer', {
			method: 'POST',
			body: JSON.stringify({ number: num.dryerNum }),
		});

		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setDryerList(list.dryerList);
	};

	const handleNextLaundry = async () => {
		if (laundryList.length <= 0) return;
		const response = await fetch(`/api/getList?id=${laundryList[0].id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setLaundryList(list.laundryList);
	};
	const handleNextDryer = async () => {
		if (dryerList.length <= 0) return;
		const response = await fetch(`/api/dryer?id=${dryerList[0].id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setDryerList(list.dryerList);
	};

	const removeLaundry = async (id: number) => {
		const response = await fetch(`/api/getList?id=${id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setLaundryList(list.laundryList);
	};
	const removeDryer = async (id: number) => {
		const response = await fetch(`/api/dryer?id=${id}`, {
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setDryerList(list.dryerList);
	};

	console.log(num);

	return (
		<main className={styles.main}>
			<div className={styles.center}>
				<h1 className={styles.header}>LAUNDRY BUZZER</h1>
				<p className={styles.currNum}>
					Current laundry number is:{' '}
					<strong>{laundryList[0]?.number || ''}</strong>
				</p>
				<p className={styles.currNum}>
					Current dryer number is: <strong>{dryerList[0]?.number || ''}</strong>
				</p>
				<div className={styles.flex}>
					<div className={styles.waiting}>
						<h2>Laundry:</h2>
						<ul>
							{laundryList.slice(1).map((number) => {
								return (
									<li key={number.id} className={styles.item}>
										{number.number}{' '}
										<span onClick={() => removeLaundry(number.id)}>X</span>
									</li>
								);
							})}
						</ul>
					</div>
					<div className={styles.waiting}>
						<h2>Dryer:</h2>
						<ul>
							{dryerList.slice(1).map((number) => {
								return (
									<li key={number.id} className={styles.item}>
										{number.number}{' '}
										<span onClick={() => removeDryer(number.id)}>X</span>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<div onClick={handleNextLaundry} className={styles.btn}>
					NEXT LAUNDRY
				</div>
				<div onClick={handleNextDryer} className={styles.btn}>
					NEXT DRYER
				</div>

				<form className={styles.form}>
					<label>
						Laundry:{' '}
						<input
							className={styles.add_input}
							placeholder='Add you number to the waiting list'
							onChange={(event) => {
								setNum({ ...num, laundryNum: event.target.value });
							}}
							value={num?.laundryNum || ''}
						/>
					</label>
					<button
						className={styles.button}
						onClick={(e) => handleAddLaundry(e)}
					>
						Add Number
					</button>
					<label>
						Dryer:{' '}
						<input
							className={styles.add_input}
							placeholder='Add you number to the waiting list'
							onChange={(event) => {
								setNum({ ...num, dryerNum: event.target.value });
							}}
							value={num?.dryerNum || ''}
						/>
					</label>
					<button className={styles.button} onClick={(e) => handleAddDryer(e)}>
						Add Number
					</button>
				</form>
			</div>
		</main>
	);
};

export default Home;
