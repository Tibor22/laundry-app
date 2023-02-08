// @ts-nocheck
import { Server } from 'socket.io';
import { Request } from 'express';
import cors from 'cors';

const SocketHandler = (req: Request, res: any) => {
	if (res?.socket.server.io) {
		console.log('Socket is already running');
	} else {
		console.log('Socket is initializing');
		const io = new Server(res.socket.server);
		// io.use(cors({ origin: '*' }));
		res.socket.server.io = io;
		io.on('connection', (socket) => {
			socket.on('send_laundry_list', (waitingList) => {
				socket.broadcast.emit('receive_laundry_list', waitingList);
			});
			socket.on('send_dryer_list', (waitingList) => {
				socket.broadcast.emit('receive_dryer_list', waitingList);
			});
		});
	}
	res.end();
};

export default SocketHandler;
