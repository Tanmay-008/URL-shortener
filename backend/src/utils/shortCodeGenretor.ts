import { customAlphabet } from 'nanoid';


const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const generateShortCode = customAlphabet(BASE62, 7);



