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

	console.log(num);

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

		if (
			(num.laundryNum && isNaN(parseInt(num.laundryNum, 10))) ||
			num.dryerNum === ''
		)
			return;
		const response = await fetch('/api/getList', {
			method: 'POST',
			body: JSON.stringify({ number: num.laundryNum }),
		});

		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setNum({ ...num, laundryNum: '' });
		setLaundryList(list.laundryList);
	};
	const handleAddDryer = async (e: any) => {
		e.preventDefault();
		if (
			(num.dryerNum && isNaN(parseInt(num.dryerNum, 10))) ||
			num.dryerNum === ''
		)
			return;
		console.log('NUMber:', num.dryerNum);
		const response = await fetch('/api/dryer', {
			method: 'POST',
			body: JSON.stringify({ number: num.dryerNum }),
		});

		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setNum({ ...num, dryerNum: '' });
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
				<h1 className={styles.header}>CALEDONIAN HOUSE</h1>
				<div className={styles.flex}>
					<div className={styles.wrapper}>
						<h2 className={styles.header}>Washing</h2>
						<p className={styles.currNum}>
							<strong>{laundryList[0]?.number || ''}</strong>
						</p>
						<div onClick={handleNextLaundry} className={styles.btn}>
							FINISHED
						</div>
						<h2>Waiting</h2>
						<ul className={styles.list_container}>
							{laundryList.slice(1).map((number) => {
								return (
									<li key={number.id} className={styles.item}>
										<div></div>
										<div>{number.number} </div>

										<span
											className={styles.remove}
											onClick={() => removeLaundry(number.id)}
										>
											X
										</span>
									</li>
								);
							})}
						</ul>
						<div className={styles.form_controller}>
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
						</div>
					</div>
					<div className={styles.center_line}></div>
					<div className={styles.wrapper}>
						<h2 className={styles.header}>Dryer</h2>
						<p className={styles.currNum}>
							<strong>{dryerList[0]?.number || ''}</strong>
						</p>

						<div onClick={handleNextDryer} className={styles.btn}>
							FINISHED
						</div>
						<h2>Waiting</h2>
						<ul className={styles.list_container}>
							{dryerList.slice(1).map((number) => {
								return (
									<li key={number.id} className={styles.item}>
										<div></div>
										<div>{number.number} </div>
										<span
											className={styles.remove}
											onClick={() => removeDryer(number.id)}
										>
											X
										</span>
									</li>
								);
							})}
						</ul>
						<div className={styles.form_controller}>
							<label>
								Dryer:{' '}
								<input
									type='text'
									className={styles.add_input}
									placeholder='Add you number to the waiting list'
									onChange={(event) => {
										setNum({ ...num, dryerNum: event.target.value });
									}}
									value={num?.dryerNum || ''}
								/>
							</label>
							<button
								className={styles.button}
								onClick={(e) => handleAddDryer(e)}
							>
								Add Number
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
