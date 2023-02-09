import { Dispatch, SetStateAction, MouseEvent, useState } from 'react';
import { DryerList, LaundryList, Num } from '../types';
import styles from '../styles/main.module.css';

type Props = {
	list: LaundryList | DryerList;
	handleNext: () => void;
	remove: (id: number) => void;
	setNum: Dispatch<SetStateAction<Num>>;
	num: Num;
	handleAdd: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	name: string;
};

export default function LaundryComponent({
	list,
	handleNext,
	remove,
	setNum,
	num,
	handleAdd,
	name,
}: Props) {
	console.log(list);

	const [floating, setFloating] = useState(0);
	const [addedTwice, setAddedTwice] = useState(false);

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.header}>{name}</h2>
			<p className={styles.currNum}>
				{list.length >= 1 && (
					<>
						<strong>{list[0]?.number || ''}</strong>{' '}
						{list[0]?.twice && <span style={{ color: '#ffa723' }}>X2</span>}
					</>
				)}
			</p>
			<div onClick={handleNext} className={styles.button}>
				FINISHED
			</div>
			<h2 className={styles.header_2}>Waiting</h2>
			<ul className={styles.list_container}>
				{list.length >= 2 &&
					list.slice(1).map((number, i) => {
						return (
							<li key={number.id} className={styles.item}>
								<div></div>
								<div>
									{number.number}{' '}
									{number.twice && <span className={styles.twice}>X2</span>}
								</div>

								<span
									className={styles.remove}
									onClick={() => remove(number.id)}
								>
									X
								</span>
							</li>
						);
					})}
			</ul>
			<div className={styles.form_controller}>
				<label>
					<div>
						<input
							className={styles.add_input}
							placeholder='Add you number to the waiting list'
							onChange={(event) => {
								name === 'Laundry'
									? setNum({ ...num, laundryNum: event.target.value })
									: setNum({ ...num, dryerNum: event.target.value });
							}}
							value={
								name === 'Laundry' ? num?.laundryNum || '' : num?.dryerNum || ''
							}
						/>
						<button
							onClick={() => {
								name === 'Laundry'
									? setNum({ ...num, twiceLaundry: !num.twiceLaundry })
									: setNum({ ...num, twiceDryer: !num.twiceDryer });
								setAddedTwice(!addedTwice);
								setFloating(1);
							}}
							className={
								addedTwice
									? `${styles.times_2} ${styles.green}`
									: styles.times_2
							}
						>
							X2
						</button>

						<div
							onAnimationEnd={() => setFloating(0)}
							// @ts-ignore:next-line
							floating={floating}
							className={styles.floating_numbers}
						>
							{addedTwice ? 'X2 ADDED' : 'X2 REMOVED'}
						</div>
					</div>
				</label>

				<button
					className={styles.button}
					onClick={(e) => {
						handleAdd(e);
						setAddedTwice(false);
					}}
				>
					Add Number
				</button>
			</div>
		</div>
	);
}
