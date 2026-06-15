import { createSlice } from '@reduxjs/toolkit';
import userModel from '../api/model/userModel';

export const emptyUserState: userModel = {
    id: '',
    idNumber: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    email: '',
    isSouthAfrican: false,
    role: '',
    token: '',
};

export const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: emptyUserState,
    reducers: {
        setLoggedInUser: (state, action) => {
            console.log(action);
            state.id = action.payload.id;
            state.idNumber = action.payload.idNumber;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.address = action.payload.address;
            state.phoneNumber = action.payload.phoneNumber;
            state.email = action.payload.email;
            state.isSouthAfrican = action.payload.isSouthAfrican;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
        updateUserProfile: (state, action) => {
            state.idNumber = action.payload.idNumber ?? state.idNumber;
            state.firstName = action.payload.firstName ?? state.firstName;
            state.lastName = action.payload.lastName ?? state.lastName;
            state.address = action.payload.address ?? state.address;
            state.phoneNumber = action.payload.phoneNumber ?? state.phoneNumber;
            state.email = action.payload.email ?? state.email;
            state.isSouthAfrican = action.payload.isSouthAfrican ?? state.isSouthAfrican;
        },
        clearUser: (state) => {
            state.id = '';
            state.idNumber = '';
            state.firstName = '';
            state.lastName = '';
            state.address = '';
            state.phoneNumber = '';
            state.email = '';
            state.isSouthAfrican = false;
            state.role = '';
            state.token = '';
        },
    },
});

export const { setLoggedInUser, updateUserProfile, clearUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
