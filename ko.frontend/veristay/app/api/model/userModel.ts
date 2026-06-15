export default interface userModel {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    email: string;
    isSouthAfrican: boolean;
    role: string;
    token: string;
}

export interface jwtDecodeModel {
    uid: string;
    name: string;
    role: string;
}
