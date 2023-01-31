import { LaundryList, LaundryNumber, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ListHandler = async (req, res) => {
	if (req.method === 'POST') {
		const obj = JSON.parse(req.body);
		const { number } = obj;
		await prisma.laundryNumber.create({
			data: {
				number: Number(number),
				laundryListId: 1,
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
