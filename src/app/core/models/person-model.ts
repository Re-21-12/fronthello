export interface PersonModel {
    id:        number;
    firstName: string;
    lastName:  string;
    email:     string;
    createdAt: Date;
    updatedAt: null;
    orders:    any[];
}
