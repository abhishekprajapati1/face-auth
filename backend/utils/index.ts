import *  as bcrypt from 'bcrypt';

export const hashString = (str: string) => {
    const saltRounds = 10;
    return bcrypt.hashSync(str, saltRounds);
}

export const compareStrings = (plain: string , hashed: string) => {
    return bcrypt.compareSync(plain, hashed);
}