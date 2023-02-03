import { LaundryList, LaundryNumber } from '@prisma/client';
import { Request, Response } from 'express';

import prisma from '../../prisma/init';

const ListHandler = async (req: Request, res: Response) => {
	if (req.method === 'POST') {
		const obj = JSON.parse(req.body);
		const { number, twice } = obj;
		console.log({ number, twice });
		await prisma.laundryNumber.create({
			data: {
				number: Number(number),
				laundryListId: 1,
				twice: Boolean(twice),
			},
		});
	}
	if (req.method === 'DELETE' && req.query) {
		const { id } = req.query;
		await prisma.laundryNumber.delete({
			where: { id: Number(id) },
		});
	}
	const laundryList:
		| (LaundryList & {
				laundryNumber: LaundryNumber[];
		  })
		| null = await prisma.laundryList.findUnique({
		where: {
			id: 1,
		},
		include: { laundryNumber: true },
	});
	res.status(200).send({ laundryList: laundryList?.laundryNumber });
};

export default ListHandler;
