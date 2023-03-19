import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles/main.module.css';
import LaundryComponent from '@/components/laundryComponent';
import useSound from 'use-sound';
import InstructionsModal from '@/components/InstructionsModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DryerList, LaundryList, Num } from '../types';

let socket: any;

// export async function getServerSideProps() {
// 	// Fetch data from external API
// 	const response1 = await fetch(
// 		'https://laundry-app-caledonian.vercel.app/api/laundry'
// 	);
// 	const list1 = await response1.json();
// 	const response2 = await fetch(
// 		'https://laundry-app-caledonian.vercel.app/api/dryer'
// 	);
// 	const list2 = await response2.json();

// 	// Pass data to the page via props
// 	return { props: { list1, list2 } };
// }

const Home = () => {
	const [laundryList, setLaundryList] = useState<LaundryList>([]);
	const [dryerList, setDryerList] = useState<DryerList>([]);
	const [num, setNum] = useState<Num>({
		twiceLaundry: false,
		twiceDryer: false,
	});
	const [play] = useSound('/sounds/ping.mp3');
	const backendAddress = 'https://laundry-server-b4eu.onrender.com';
	console.log('BACKEND ADDRESS:', backendAddress);

	useEffect(() => {
		const socketInitializer = async () => {
			socket = io(`${backendAddress}`);

			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('receive_laundry_list', (waitingList: any) => {
				play();
				setLaundryList(waitingList.waitingList);
			});
			socket.on('receive_dryer_list', (waitingList: any) => {
				play();
				setDryerList(waitingList.waitingList);
			});
		};
		socketInitializer();
	}, [play]);

	useEffect(() => {
		const getList = async () => {
			const response1 = await fetch(`${backendAddress}/laundries`);
			const list1 = await response1.json();
			const response2 = await fetch(`${backendAddress}/dryers`);
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
		const response = await fetch(`${backendAddress}/laundries`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ number: num.laundryNum, twice: num.twiceLaundry }),
		});

		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setNum({ ...num, laundryNum: '', twiceLaundry: false });
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
		const response = await fetch(`${backendAddress}/dryers`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ number: num.dryerNum, twice: num.twiceDryer }),
		});

		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setNum({ ...num, dryerNum: '', twiceDryer: false });
		setDryerList(list.dryerList);
	};

	const handleNextLaundry = async () => {
		if (laundryList.length <= 0) return;
		const response = await fetch(
			`${backendAddress}/laundries?id=${laundryList[0].id}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			}
		);
		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});

		setLaundryList(list.laundryList);
	};
	const handleNextDryer = async () => {
		if (dryerList.length <= 0) return;
		const response = await fetch(
			`${backendAddress}/dryers?id=${dryerList[0].id}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			}
		);
		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});

		setDryerList(list.dryerList);
	};

	const removeLaundry = async (id: number) => {
		const response = await fetch(`${backendAddress}/laundries?id=${id}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_laundry_list', {
			waitingList: list.laundryList,
		});
		setLaundryList(list.laundryList);
	};
	const removeDryer = async (id: number) => {
		const response = await fetch(`${backendAddress}/dryers?id=${id}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		});
		const list = await response.json();
		socket.emit('send_dryer_list', {
			waitingList: list.dryerList,
		});
		setDryerList(list.dryerList);
	};

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
			<InstructionsModal />
		</main>
	);
};

export default Home;
