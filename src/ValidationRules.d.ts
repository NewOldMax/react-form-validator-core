// Type definitions for react-form-validator-core 0.6.4
// Definitions by: Siraj Alam https://github.com/sirajalam049


declare function isExisty(value: any): boolean

declare function isEmpty(value: any): boolean

declare function isEmptyTrimmed(value: any): boolean

declare module validations {

    export function matchRegexp(value: string, regexp: RegExp | string): boolean

    export function isEmail(value: string): boolean

    export function isEmpty(value: any): boolean

    export function required(value: any): boolean

    export function trim(value: any): boolean

    export function isNumber(value: any): boolean

    export function isFloat(value: any): boolean

    export function isPositive(value: any): boolean

    export function maxNumber(value: any, max: number): boolean

    export function minNumber(value: any, min: number): boolean

    export function maxFloat(value: any, max: number): boolean

    export function minFloat(value: any, min: number): boolean

    export function isString(value: any): boolean

    export function minStringLength(value: any, length: number): boolean

    export function maxStringLength(value: any, length: number): boolean

    export function isFile(value: any): boolean

    export function maxFileSize(value: any, max: number): boolean

    export function allowedExtensions(value: any, fileTypes: Array<string>): boolean

}

export default validations;