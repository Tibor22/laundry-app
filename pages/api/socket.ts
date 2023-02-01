import { Server } from 'Socket.IO';
import { Request, Response } from 'express';
const SocketHandler = (req: Request, res: any) => {
	if (res?.socket.server.io) {
		console.log('Socket is already running');
	} else {
		console.log('Socket is initializing');
		const io = new Server(res.socket.server);
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
