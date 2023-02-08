export type LaundryNumber = {
	id: number;
	laundryListId: number;
	number: number;
	twice: boolean;
};
export type DryerNumber = {
	id: number;
	dryerListId: number;
	number: number;
	twice: boolean;
};
export type LaundryList = LaundryNumber[] | [];
export type DryerList = DryerNumber[] | [];
export type Num = {
	laundryNum?: string;
	dryerNum?: string;
	twiceLaundry: boolean;
	twiceDryer: boolean;
};
