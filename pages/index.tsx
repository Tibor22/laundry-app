import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles/main.module.css';
import LaundryComponent from '@/components/laundryComponent';
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
			num.laundryNum === '' ||
			num.laundryNum === undefined
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
			num.dryerNum === '' ||
			num.dryerNum === undefined
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
					<LaundryComponent
						handleAdd={handleAddLaundry}
						num={num}
						setNum={setNum}
						remove={removeLaundry}
						handleNext={handleNextLaundry}
						list={laundryList}
						name={'Laundry'}
					/>
					<div className={styles.center_line}></div>
					<LaundryComponent
						handleAdd={handleAddDryer}
						num={num}
						setNum={setNum}
						remove={removeDryer}
						handleNext={handleNextDryer}
						list={dryerList}
						name={'Dryer'}
					/>
				</div>
			</div>
		</main>
	);
};

export default Home;
