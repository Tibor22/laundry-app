import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import styles from './instructions.module.css';
import ListGroup from 'react-bootstrap/ListGroup';

const InstructionsModal: React.FC = () => {
	const [show, setShow] = useState(true);

	const handleClose = () => setShow(false);

	return (
		<>
			{show && (
				<div
					className='modal'
					style={{
						display: 'block',
						position: 'absolute',
						color: 'black',
					}}
				>
					<Modal.Dialog>
						<Modal.Header onClick={handleClose} closeButton>
							<Modal.Title style={{ color: 'black', fontSize: '3rem' }}>
								Instructions
							</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							<ListGroup className={styles.list_item} as='ol' numbered>
								<ListGroup.Item as='li'>
									{`To use laundry/dryer just write your house number in the
										field on the bottom.`}
								</ListGroup.Item>
								<ListGroup.Item as='li'>
									If you wanna use laundry/dryer twice just click on
									&quot;X2&quot; button.
								</ListGroup.Item>
								<ListGroup.Item as='li'>
									Click on &quot;Add Number&quot; to add your number to the
									list.
								</ListGroup.Item>
								<ListGroup.Item variant='warning' as='li'>
									If you finished with your laundry/dryer click on
									&quot;FINISHED&quot; button so the next one can start their
									laundry/dryer.
								</ListGroup.Item>
							</ListGroup>
						</Modal.Body>
					</Modal.Dialog>
				</div>
			)}
		</>
	);
};

export default InstructionsModal;
