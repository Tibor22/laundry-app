import { Dispatch, SetStateAction, MouseEvent } from 'react';
import styles from '../styles/main.module.css';

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

	return (
		<div className={styles.wrapper}>
			<h2 className={styles.header}>{name}</h2>
			<p className={styles.currNum}>
				<strong>{list[0]?.number || ''}</strong>
			</p>
			<div onClick={handleNext} className={styles.btn}>
				FINISHED
			</div>
			<h2>Waiting</h2>
			<ul className={styles.list_container}>
				{list.slice(1).map((number) => {
					return (
						<li key={number.id} className={styles.item}>
							<div></div>
							<div>{number.number} </div>

							<span className={styles.remove} onClick={() => remove(number.id)}>
								X
							</span>
						</li>
					);
				})}
			</ul>
			<div className={styles.form_controller}>
				<label>
					{name}
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
				</label>
				<button className={styles.button} onClick={(e) => handleAdd(e)}>
					Add Number
				</button>
			</div>
		</div>
	);
}
