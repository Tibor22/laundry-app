import { PrismaClient, DryerNumber, DryerList } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const DryerHandler = async (req: Request, res: Response) => {
	console.log('REQ:', req.body);
	if (req.method === 'POST') {
		const obj = JSON.parse(req.body);
		const { number } = obj;

		//create list

		// await prisma.dryerList.create({ data: {} });
		await prisma.dryerNumber.create({
			data: {
				number: Number(number),
				dryerListId: 1,
			},
		});
	}
	if (req.method === 'DELETE' && req.query) {
		const { id } = req.query;
		await prisma.dryerNumber.delete({
			where: { id: Number(id) },
		});
	}
	const dryerList:
		| (DryerList & {
				dryerNumber: DryerNumber[];
		  })
		| null = await prisma.dryerList.findUnique({
		where: {
			id: 1,
		},
		include: { dryerNumber: true },
	});
	res.status(200).send({ dryerList: dryerList?.dryerNumber });
};

export default DryerHandler;