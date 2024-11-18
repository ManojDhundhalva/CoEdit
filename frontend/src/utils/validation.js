import { emailRegex, validInputEmailRegex, nameRegex, usernameRegex, spaceIgnoreRegex, fullNameRegex, projectNameRegex } from './regex';

export const isValidEmail = (email) => emailRegex.test(email);

export const isInputValidEmail = (email) => validInputEmailRegex.test(email);

export const isValidUserName = (email) => usernameRegex.test(email);

export const isValidFullName = (fullName) => fullNameRegex.test(fullName);

export const isValidProjectName = (projectName) => projectNameRegex.test(projectName);

export const isSpace = (str) => spaceIgnoreRegex.test(str);

export function isAlphabetic(str) {
    return nameRegex.test(str);
}